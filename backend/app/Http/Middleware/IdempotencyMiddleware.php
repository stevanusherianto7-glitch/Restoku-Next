<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\IdempotencyRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Closure;

class IdempotencyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $idempotencyKey = $request->header('X-Idempotency-Key');

        if (!$idempotencyKey) {
            return response()->json(['error' => 'Missing idempotency key'], 400);
        }

        // Check if already processed
        $existing = IdempotencyRecord::where('key', $idempotencyKey)->first();

        if ($existing && $existing->status === 'completed') {
            return response()->json($existing->response_body);
        }

        if ($existing && $existing->status === 'processing') {
            return response()->json(['error' => 'Request in progress'], 409);
        }

        // Create record
        $record = IdempotencyRecord::create([
            'key' => $idempotencyKey,
            'request_path' => $request->path(),
            'request_method' => $request->method(),
            'request_hash' => hash('sha256', $request->getContent()),
            'status' => 'processing',
        ]);

        try {
            $response = $next($request);

            // Store response for idempotency
            $record->update([
                'status' => 'completed',
                'response_body' => json_decode($response->getContent(), true),
            ]);

            return $response;
        } catch (\Exception $e) {
            $record->delete();
            throw $e;
        }
    }
}
