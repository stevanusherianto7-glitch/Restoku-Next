# Prompt: Backend Restoku — Layered Architecture (Laravel)

## Context

```
## Context (carry forward)
- Stack: Laravel 13 + PHP 8.2+ + PostgreSQL 15 + Redis
- Architecture: Hexagonal (Ports & Adapters) + Vertical Slicing
- Namespace: App\Features\[Feature]\{Domain,Application,Infrastructure,Http}
- Auth: Laravel Sanctum (JWT)
- Queue: Laravel Queue (Redis)
- Real-time: Laravel Reverb (WebSocket)
```

---

## Prompt 1: Inisialisasi Feature Module

```
Buatkan feature module baru untuk [feature-name] di Laravel dengan struktur:

app/Features/[FeatureName]/
├── Domain/
│   ├── Entities/         # Core business entities
│   ├── ValueObjects/     # Value objects, enums
│   └── Services/         # Pure domain services
├── Application/
│   ├── UseCases/         # Business operations
│   ├── Ports/            # Interfaces (repositories, external services)
│   └── DTOs/             # Data transfer objects
├── Infrastructure/
│   ├── Adapters/         # Port implementations
│   ├── Repositories/     # Eloquent repositories
│   └── Mappers/          # Data mappers
└── Http/
    ├── Controllers/      # API controllers
    ├── Requests/         # Form request validation
    ├── Resources/        # API resources (transformers)
    └── Routes/           # Route definitions

Rules:
- Domain: pure PHP, NO Laravel/Illuminate dependency
- Application: orchestrate domain + ports
- Infrastructure: implement ports, can use Eloquent
- Http: controllers, requests, resources (thin layer)
```

---

## Prompt 2: Buat Entity & Value Object

```
Buatkan entity dan value object untuk fitur [feature-name]:

1. Entity di Domain/Entities/[EntityName].php:
   - Class dengan properties yang jelas
   - Pure methods untuk business logic
   - Immutable (readonly properties)
   - No Laravel/Illuminate dependency

2. Value Object di Domain/ValueObjects/[ValueObjectName].php:
   - Immutable class
   - Equality by value
   - Validation in constructor
   - Examples: Money, Email, OrderId

Contoh pattern:
```php
<?php
// Domain/Entities/Order.php
namespace App\Features\Order\Domain\Entities;

use App\Features\Order\Domain\ValueObjects\OrderId;
use App\Features\Order\Domain\ValueObjects\Money;
use App\Features\Order\Domain\ValueObjects\OrderStatus;

class Order
{
    public function __construct(
        public readonly OrderId $id,
        public readonly array $items,
        public readonly OrderStatus $status,
        public readonly Money $total,
        public readonly \DateTimeImmutable $createdAt,
    ) {}

    public function calculateTotal(): Money
    {
        $total = array_reduce($this->items, fn($sum, $item) => $sum + $item->price->amount * $item->quantity, 0);
        return new Money($total);
    }

    public function canBeCancelled(): bool
    {
        return $this->status === OrderStatus::Pending;
    }
}

// Domain/ValueObjects/Money.php
namespace App\Features\Order\Domain\ValueObjects;

class Money
{
    public function __construct(public readonly int $amount)
    {
        if ($amount < 0) {
            throw new \InvalidArgumentException("Money cannot be negative");
        }
    }

    public function add(self $other): self
    {
        return new self($this->amount + $other->amount);
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount;
    }
}
```
```

---

## Prompt 3: Buat Use Case & Port

```
Buatkan use case dan port untuk fitur [feature-name]:

1. Port di Application/Ports/[RepositoryName].php:
   - Interface untuk repository/external service
   - Method signature dengan return type yang jelas
   - NO Laravel dependency

2. Use Case di Application/UseCases/[OperationName].php:
   - Class dengan constructor injection (port interfaces)
   - Public method: execute(InputDTO): OutputDTO
   - Impure sandwich pattern: side-effect → pure → side-effect
   - Import entity dari domain, port dari application

Contoh pattern:
```php
<?php
// Application/Ports/OrderRepository.php
namespace App\Features\Order\Application\Ports;

use App\Features\Order\Domain\Entities\Order;
use App\Features\Order\Domain\ValueObjects\OrderId;

interface OrderRepository
{
    public function save(Order $order): void;
    public function findById(OrderId $id): ?Order;
    public function findAll(): array;
}

// Application/UseCases/CreateOrderUseCase.php
namespace App\Features\Order\Application\UseCases;

use App\Features\Order\Application\Ports\OrderRepository;
use App\Features\Order\Domain\Entities\Order;
use App\Features\Order\Domain\ValueObjects\Money;
use App\Features\Order\Domain\ValueObjects\OrderStatus;
use App\Features\Order\Application\DTOs\CreateOrderInput;
use App\Features\Order\Application\DTOs\OrderOutput;

class CreateOrderUseCase
{
    public function __construct(
        private readonly OrderRepository $repository,
    ) {}

    public function execute(CreateOrderInput $input): OrderOutput
    {
        // Pure domain logic
        $total = $this->calculateTotal($input->items);
        $order = new Order(
            id: OrderId::generate(),
            items: $input->items,
            status: OrderStatus::Pending,
            total: $total,
            createdAt: new \DateTimeImmutable(),
        );

        // Side-effect (infrastructure)
        $this->repository->save($order);

        return OrderOutput::fromEntity($order);
    }

    private function calculateTotal(array $items): Money
    {
        $total = array_reduce($items, fn($sum, $item) => $sum + $item['price'] * $item['quantity'], 0);
        return new Money($total);
    }
}
```
```

---

## Prompt 4: Buat Repository (Infrastructure)

```
Buatkan Eloquent repository untuk fitur [feature-name]:

1. Model di Infrastructure/Eloquent/[ModelName].php:
   - Eloquent model
   - Relationship definitions
   - Casts untuk value objects
   - NO business logic

2. Repository di Infrastructure/Repositories/[RepositoryName]Eloquent.php:
   - Implement port interface dari application
   - Gunakan Eloquent model
   - Convert entity ↔ model

Contoh pattern:
```php
<?php
// Infrastructure/Eloquent/Order.php
namespace App\Features\Infrastructure\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $table = 'orders';
    protected $fillable = ['status', 'total', 'created_at'];
    protected $casts = ['total' => 'integer', 'created_at' => 'datetime'];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

// Infrastructure/Repositories/OrderRepositoryEloquent.php
namespace App\Features\Infrastructure\Repositories;

use App\Features\Order\Application\Ports\OrderRepository;
use App\Features\Order\Domain\Entities\Order;
use App\Features\Order\Domain\ValueObjects\OrderId;
use App\Features\Infrastructure\Eloquent\Order as OrderModel;

class OrderRepositoryEloquent implements OrderRepository
{
    public function __construct(private OrderModel $model) {}

    public function save(Order $order): void
    {
        $this->model->create([
            'id' => $order->id->value,
            'status' => $order->status->value,
            'total' => $order->total->amount,
        ]);
    }

    public function findById(OrderId $id): ?Order
    {
        $model = $this->model->find($id->value);
        return $model ? $this->toEntity($model) : null;
    }

    private function toEntity(OrderModel $model): Order
    {
        return new Order(
            id: new OrderId($model->id),
            items: $model->items->toArray(),
            status: OrderStatus::from($model->status),
            total: new Money($model->total),
            createdAt: $model->created_at,
        );
    }
}
```
```

---

## Prompt 5: Buat Controller & Request

```
Buatkan controller dan request validation untuk fitur [feature-name]:

1. Controller di Http/Controllers/[FeatureName]Controller.php:
   - Thin controller (delegate ke use case)
   - Inject use case via constructor
   - Return API resource
   - Handle errors

2. Request di Http/Requests/[OperationName]Request.php:
   - Form request validation
   - Rules yang jelas
   - Custom messages

3. Resource di Http/Resources/[ResourceName]Resource.php:
   - Transform entity ke JSON
   - Consistent format

Contoh pattern:
```php
<?php
// Http/Controllers/OrderController.php
namespace App\Features\Order\Http\Controllers;

use App\Features\Order\Application\UseCases\CreateOrderUseCase;
use App\Features\Order\Http\Requests\CreateOrderRequest;
use App\Features\Order\Http\Resources\OrderResource;
use Illuminate\Http\JsonResponse;

class OrderController
{
    public function __construct(
        private readonly CreateOrderUseCase $createOrder,
    ) {}

    public function store(CreateOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->createOrder->execute($request->toDTO());
            return (new OrderResource($order))
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}

// Http/Requests/CreateOrderRequest.php
namespace App\Features\Order\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string|max:255',
        ];
    }

    public function toDTO(): CreateOrderInput
    {
        return new CreateOrderInput(
            items: $this->validated('items'),
        );
    }
}

// Http/Resources/OrderResource.php
namespace App\Features\Order\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'items' => $this->items,
            'total' => $this->total,
            'created_at' => $this->created_at,
        ];
    }
}
```
```

---

## Prompt 6: Buat Migration & Seeder

```
Buatkan migration dan seeder untuk fitur [feature-name]:

1. Migration di database/migrations/[timestamp]_create_[table]_table.php:
   - Schema yang jelas
   - Foreign keys
   - Indexes
   - Timestamps

2. Seeder di database/seeders/[Table]Seeder.php:
   - Dummy data
   - Realistic data

Contoh pattern:
```php
<?php
// database/migrations/2026_07_23_000001_create_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']);
            $table->integer('total');
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->uuid('menu_id');
            $table->integer('quantity');
            $table->integer('price');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('menu_id')->references('id')->on('menus');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
```
```

---

## Prompt 7: Buat Service Provider

```
Buatkan service provider untuk fitur [feature-name]:

File: app/Features/[FeatureName]/Infrastructure/[FeatureName]ServiceProvider.php

Pattern:
```php
<?php
namespace App\Features\Order\Infrastructure;

use App\Features\Order\Application\Ports\OrderRepository;
use App\Features\Order\Application\UseCases\CreateOrderUseCase;
use App\Features\Order\Infrastructure\Repositories\OrderRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class OrderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind port to implementation
        $this->app->bind(OrderRepository::class, OrderRepositoryEloquent::class);

        // Register use case with dependencies
        $this->app->singleton(CreateOrderUseCase::class, function ($app) {
            return new CreateOrderUseCase(
                repository: $app->make(OrderRepository::class),
            );
        });
    }

    public function boot(): void
    {
        // Publish config, migrations, etc.
    }
}
```

Register di config/app.php:
```php
'providers' => [
    // ...
    App\Features\Order\Infrastructure\OrderServiceProvider::class,
],
```
```

---

## Prompt 8: Buat Testing

```
Buatkan testing untuk fitur [feature-name]:

1. Domain test (PHPUnit):
   - File: tests/Unit/Features/[Feature]/Domain/[Entity]Test.php
   - Test pure functions
   - No mocking needed

2. Application test (PHPUnit):
   - File: tests/Unit/Features/[Feature]/Application/[UseCase]Test.php
   - Mock ports
   - Test use case logic

3. Infrastructure test (PHPUnit + SQLite):
   - File: tests/Integration/Features/[Feature]/Infrastructure/[Repository]Test.php
   - Use in-memory database
   - Test repository implementation

4. HTTP test (PHPUnit):
   - File: tests/Feature/Features/[Feature]/Http/[Controller]Test.php
   - Test API endpoints
   - Assert status codes, response structure

Contoh:
```php
<?php
// tests/Unit/Features/Order/Domain/OrderTest.php
namespace Tests\Unit\Features\Order\Domain;

use App\Features\Order\Domain\Entities\Order;
use App\Features\Order\Domain\ValueObjects\Money;
use App\Features\Order\Domain\ValueObjects\OrderStatus;
use PHPUnit\Framework\TestCase;

class OrderTest extends TestCase
{
    public function test_can_calculate_total(): void
    {
        $order = new Order(
            id: OrderId::generate(),
            items: [
                ['price' => 15000, 'quantity' => 2],
                ['price' => 10000, 'quantity' => 1],
            ],
            status: OrderStatus::Pending,
            total: new Money(0),
            createdAt: new \DateTimeImmutable(),
        );

        $total = $order->calculateTotal();
        $this->assertEquals(40000, $total->amount);
    }
}

// tests/Feature/Features/Order/Http/OrderControllerTest.php
namespace Tests\Feature\Features\Order\Http;

use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    public function test_can_create_order(): void
    {
        $response = $this->postJson('/api/orders', [
            'items' => [
                ['menu_id' => 'uuid', 'quantity' => 2],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'status', 'total']);
    }
}
```
```

---

## Prompt 9: Setup Route

```
Buatkan route untuk fitur [feature-name]:

File: app/Features/[FeatureName]/Http/Routes/[featureName].php

Pattern:
```php
<?php
use App\Features\Order\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/orders')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
    Route::patch('/{id}/status', [OrderController::class, 'updateStatus']);
});
```

Register di routes/api.php:
```php
require __DIR__.'/../Features/Order/Http/Routes/order.php';
```
```

---

## Prompt 10: Buat DTO

```
Buatkan Data Transfer Object (DTO) untuk fitur [feature-name]:

File: app/Features/[FeatureName]/Application/DTOs/[DtoName].php

Pattern:
```php
<?php
namespace App\Features\Order\Application\DTOs;

use App\Features\Order\Domain\Entities\Order;
use App\Features\Order\Domain\ValueObjects\OrderStatus;

class CreateOrderInput
{
    public function __construct(
        public readonly array $items,
    ) {}
}

class OrderOutput
{
    public function __construct(
        public readonly string $id,
        public readonly string $status,
        public readonly array $items,
        public readonly int $total,
        public readonly string $createdAt,
    ) {}

    public static function fromEntity(Order $order): self
    {
        return new self(
            id: $order->id->value,
            status: $order->status->value,
            items: $order->items,
            total: $order->total->amount,
            createdAt: $order->createdAt->format('Y-m-d H:i:s'),
        );
    }
}
```
```

---

## Prompt 11: Refactor ke Layered Architecture

```
Refactor file [file-path] untuk mengikuti layered architecture di Laravel:

1. Identifikasi logic bisnis → pindah ke Domain/Entities/
2. Buat port interface di Application/Ports/
3. Pindah Eloquent query ke Infrastructure/Repositories/
4. Buat use case di Application/UseCases/
5. Buat controller (thin) di Http/Controllers/
6. Update service provider untuk dependency injection

Rules:
- Domain: tidak boleh import Illuminate/Laravel
- Application: tidak boleh import Infrastructure
- Infrastructure: boleh import Domain dan Application
- Http: boleh import Application, tidak boleh import Domain langsung
```

---

## Prompt 12: Setup Middleware & Auth

```
Buatkan middleware dan auth untuk fitur [feature-name]:

1. Middleware di app/Http/Middleware/[MiddlewareName].php:
   - Check auth
   - Check role/permission
   - Check resource ownership

2. Apply di route:
   - Route level: middleware('auth')
   - Controller level: __construct() with middleware
   - Global: Kernel.php

Contoh:
```php
<?php
// app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!in_array($request->user()->role, $roles)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}

// Usage in route:
Route::middleware(['auth', 'checkRole:owner,manager'])->group(function () {
    // admin routes
});
```
```

---

## Prompt 13: Digital Menu Book — Public API (Backend)

```
Buatkan public API untuk Digital Menu Book (tanpa auth):

1. Public Endpoint di app/Features/MenuPublic/Http/Controllers/MenuPublicController.php:

   GET /api/public/menu/{restaurantId}
   - Return: restaurant info + categories + menus
   - No auth required
   - Cache: 5 menit (Redis)
   - Filter: hanya menu dengan status "active"

   GET /api/public/menu/{restaurantId}/{menuId}
   - Return: detail menu + variants
   - No auth required

2. Controller:
```php
<?php
namespace App\Features\MenuPublic\Http\Controllers;

use App\Features\Menu\Application\UseCases\GetMenuPublicUseCase;
use App\Features\MenuPublic\Http\Resources\MenuPublicResource;
use Illuminate\Http\JsonResponse;

class MenuPublicController
{
    public function __construct(
        private readonly GetMenuPublicUseCase $getMenuPublic,
    ) {}

    public function index(string $restaurantId): JsonResponse
    {
        $menu = $this->getMenuPublic->execute($restaurantId);

        if (!$menu) {
            return response()->json(['error' => 'Restaurant not found'], 404);
        }

        return (new MenuPublicResource($menu))->response();
    }
}
```

3. Route (TANPA auth):
```php
<?php
use App\Features\MenuPublic\Http\Controllers\MenuPublicController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/public')->group(function () {
    Route::get('/menu/{restaurantId}', [MenuPublicController::class, 'index']);
    Route::get('/menu/{restaurantId}/{menuId}', [MenuPublicController::class, 'show']);
});
```

4. Cache Strategy:
```php
// In use case
public function execute(string $restaurantId): ?array
{
    return Cache::remember("menu_public_{$restaurantId}", 300, function () use ($restaurantId) {
        return $this->menuRepository->findPublicByRestaurant($restaurantId);
    });
}
```
```

---

## Prompt 14: Digital Menu Book — Table & QR Code Management (Backend)

```
Buatkan fitur manajemen meja dan QR code:

1. Entity di Domain/Entities/Table.php:
```php
<?php
namespace App\Features\Table\Domain\Entities;

use App\Features\Table\Domain\ValueObjects\TableId;

class RestaurantTable
{
    public function __construct(
        public readonly TableId $id,
        public readonly string $restaurantId,
        public readonly string $name, // "Meja 1", "VIP", "Teras"
        public readonly int $number,
        public readonly bool $isActive,
    ) {}

    public function getQrUrl(): string
    {
        return env('APP_URL') . "/menu/{$this->restaurantId}?table={$this->number}";
    }
}
```

2. Migration:
```php
Schema::create('restaurant_tables', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('restaurant_id');
    $table->string('name');
    $table->integer('number');
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    $table->foreign('restaurant_id')->references('id')->on('restaurants')->onDelete('cascade');
    $table->unique(['restaurant_id', 'number']);
});
```

3. Controller:
```php
<?php
namespace App\Features\Table\Http\Controllers;

use App\Features\Table\Application\UseCases\{
    CreateTableUseCase,
    DeleteTableUseCase,
    GetTablesUseCase
};
use App\Features\Table\Http\Requests\CreateTableRequest;
use App\Features\Table\Http\Resources\TableResource;

class TableController
{
    public function __construct(
        private readonly GetTablesUseCase $getTables,
        private readonly CreateTableUseCase $createTable,
        private readonly DeleteTableUseCase $deleteTable,
    ) {}

    public function index(string $restaurantId)
    {
        $tables = $this->getTables->execute($restaurantId);
        return TableResource::collection($tables);
    }

    public function store(string $restaurantId, CreateTableRequest $request)
    {
        $table = $this->createTable->execute($restaurantId, $request->validated());
        return (new TableResource($table))->response()->setStatusCode(201);
    }

    public function destroy(string $restaurantId, string $tableId)
    {
        $this->deleteTable->execute($restaurantId, $tableId);
        return response()->json(null, 204);
    }
}
```

4. QR Code Generation (menggunakan endroid/qr-code):
```php
// di Infrastructure/Services/QrCodeService.php
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

public function generateQr(string $url): string
{
    $qrCode = new QrCode($url);
    $qrCode->setSize(300);
    $qrCode->setMargin(10);

    $writer = new PngWriter();
    $result = $writer->write($qrCode);

    return base64_encode($result->getString());
}
```
```

---

## Prompt 15: Digital Menu Book — Public Order (Backend)

```
Buatkan public order endpoint untuk QR ordering (tanpa auth):

1. Entity di Domain/Entities/PublicOrder.php:
```php
<?php
namespace App\Features\PublicOrder\Domain\Entities;

class PublicOrder
{
    public function __construct(
        public readonly string $id,
        public readonly string $restaurantId,
        public readonly int $tableNumber,
        public readonly array $items,
        public readonly string $status, // received, confirmed, preparing, ready, delivered
        public readonly int $total,
        public readonly ?string $notes,
        public readonly \DateTimeImmutable $createdAt,
    ) {}
}
```

2. Public Endpoint:
```
POST /api/public/orders
- Body: { restaurantId, tableNumber, items: [{menuId, quantity, variant, notes}], notes }
- No auth required
- Rate limit: 10 per minute per IP
- Validate: menu exists, restaurant open, items available

GET /api/public/orders/{orderId}
- Return: order status + details
- No auth required
- Used by tamu untuk track status pesanan
```

3. Controller:
```php
<?php
namespace App\Features\PublicOrder\Http\Controllers;

use App\Features\PublicOrder\Application\UseCases\CreatePublicOrderUseCase;
use App\Features\PublicOrder\Http\Requests\CreatePublicOrderRequest;
use App\Features\PublicOrder\Http\Resources\PublicOrderResource;

class PublicOrderController
{
    public function __construct(
        private readonly CreatePublicOrderUseCase $createOrder,
    ) {}

    public function store(CreatePublicOrderRequest $request)
    {
        $order = $this->createOrder->execute($request->validated());

        // Dispatch queue job untuk notify POS
        new SendOrderToPosJob($order);

        return (new PublicOrderResource($order))->response()->setStatusCode(201);
    }

    public function show(string $orderId)
    {
        $order = $this->getOrder->execute($orderId);
        return new PublicOrderResource($order);
    }
}
```

4. Queue Job untuk notify POS:
```php
<?php
namespace App\Features\PublicOrder\Infrastructure\Jobs;

use App\Features\PublicOrder\Domain\Entities\PublicOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderToPosJob implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly PublicOrder $order) {}

    public function handle(): void
    {
        // Broadcast ke POS channel
        broadcast(new NewOrderEvent($this->order))->toOthers();

        // Auto-print di dapur (jika printer tersedia)
        if (config('printer.enabled')) {
            dispatch(new PrintOrderJob($this->order));
        }
    }
}
```

5. Rate Limiting:
```php
// app/Providers/RouteServiceProvider.php
Route::middleware('throttle:public-order')->group(function () {
    Route::post('/api/public/orders', [PublicOrderController::class, 'store']);
});
```

6. Validation Rules:
```php
// Http/Requests/CreatePublicOrderRequest.php
public function rules(): array
{
    return [
        'restaurantId' => 'required|uuid|exists:restaurants,id',
        'tableNumber' => 'required|integer|min:1',
        'items' => 'required|array|min:1|max:50',
        'items.*.menuId' => 'required|uuid|exists:menus,id',
        'items.*.quantity' => 'required|integer|min:1|max:99',
        'items.*.variant' => 'nullable|string|max:100',
        'items.*.notes' => 'nullable|string|max:255',
        'notes' => 'nullable|string|max:500',
    ];
}
```
```

---

## Prompt 16: Digital Menu Book — Real-time Status (Backend)

```
Buatkan real-time update untuk status pesanan QR ordering:

1. Event di Domain/Events/OrderStatusUpdatedEvent.php:
```php
<?php
namespace App\Features\PublicOrder\Domain\Events;

use App\Features\PublicOrder\Domain\Entities\PublicOrder;

class OrderStatusUpdatedEvent
{
    public function __construct(
        public readonly PublicOrder $order,
        public readonly string $oldStatus,
        public readonly string $newStatus,
    ) {}
}
```

2. Broadcast Channel:
```php
// routes/channels.php
Broadcast::channel('public-order.{orderId}', function ($orderId) {
    return true; // Public channel, no auth needed
});
```

3. Listener untuk update status dari POS:
```php
<?php
namespace App\Features\PublicOrder\Infrastructure\Listeners;

use App\Features\PublicOrder\Domain\Events\OrderStatusUpdatedEvent;
use Illuminate\Support\Facades\Broadcast;

class BroadcastOrderStatusListener
{
    public function handle(OrderStatusUpdatedEvent $event): void
    {
        Broadcast::to("public-order.{$event->order->id}")
            ->broadcast(new OrderStatusUpdate(
                orderId: $event->order->id,
                status: $event->newStatus,
                updatedAt: now()->toISOString(),
            ));
    }
}
```

4. Frontend hook untuk listen:
```ts
// features/menu-public/ui/hooks/useOrderStatus.ts
import { useEffect } from "react";
import { Echo } from "@shared/infrastructure/realtime/Echo";

export function useOrderStatus(orderId: string, callback: (status: string) => void) {
  useEffect(() => {
    const channel = Echo.channel(`public-order.${orderId}`);

    channel.listen("OrderStatusUpdate", (data: { status: string }) => {
      callback(data.status);
    });

    return () => {
      channel.leave();
    };
  }, [orderId, callback]);
}
```
```

---

## Prompt 17: Digital Menu Book — Analytics (Backend)

```
Buatkan analytics untuk Digital Menu Book:

1. Tracking endpoint:
```
POST /api/public/menu/{restaurantId}/track
- Body: { event: "view" | "add_to_cart" | "order", menuId?, tableNumber? }
- No auth required
- Store di database: menu_views, cart_events, order_events
```

2. Migration:
```php
Schema::create('menu_analytics', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('restaurant_id');
    $table->uuid('menu_id')->nullable();
    $table->integer('table_number')->nullable();
    $table->enum('event', ['view', 'add_to_cart', 'order']);
    $table->string('ip_address', 45)->nullable();
    $table->string('user_agent')->nullable();
    $table->timestamps();

    $table->index(['restaurant_id', 'created_at']);
    $table->index(['menu_id', 'event']);
});
```

3. Use case untuk report:
```php
<?php
namespace App\Features\MenuAnalytics\Application\UseCases;

class GetMenuAnalyticsUseCase
{
    public function execute(string $restaurantId, string $period = '7d'): array
    {
        $startDate = match($period) {
            '24h' => now()->subDay(),
            '7d' => now()->subWeek(),
            '30d' => now()->subMonth(),
            default => now()->subWeek(),
        };

        return [
            'total_views' => $this->getViews($restaurantId, $startDate),
            'total_orders' => $this->getOrders($restaurantId, $startDate),
            'conversion_rate' => $this->getConversionRate($restaurantId, $startDate),
            'popular_menus' => $this->getPopularMenus($restaurantId, $startDate),
            'orders_by_table' => $this->getOrdersByTable($restaurantId, $startDate),
        ];
    }
}
```
```
```
