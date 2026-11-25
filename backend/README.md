# Kampüs Etkinlik API (Backend)

Express ile yazılmış, etkinlikleri JSON olarak sunan REST API. Veriler **MongoDB**'de (Mongoose ile) saklanır; sunucu yeniden başlasa da kayıtlar kaybolmaz. Etkinlikler oluşturulabilir, listelenebilir, aranabilir, güncellenebilir ve silinebilir (tam CRUD).

## Çalıştırma

```bash
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env
# .env içindeki MONGODB_URI değerini kendi MongoDB adresinle değiştir
npm run seed             # örnek 6 etkinliği veritabanına yükler
npm run dev
```

Sunucu `http://localhost:3000` adresinde açılır. Sağlık kontrolü: <http://localhost:3000/health>

## Ortam değişkenleri

| Değişken | Açıklama | Örnek |
| --- | --- | --- |
| `PORT` | Sunucunun dinleyeceği port (isteğe bağlı) | `3000` |
| `MONGODB_URI` | MongoDB bağlantı adresi (zorunlu) | `mongodb://127.0.0.1:27017/kampus` |

`.env` dosyası GitHub'a gönderilmez. Gerçek adres (kullanıcı adı ve şifre dahil) yalnızca kendi `.env` dosyanda durur. Gerekli değişkenler için `.env.example` dosyasına bakın.

Yerel MongoDB için `mongodb://127.0.0.1:27017/kampus`, MongoDB Atlas için Atlas'ın verdiği `mongodb+srv://...` adresi kullanılabilir. Veritabanı adı adresin sonundaki `/kampus` kısmıdır.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | `node --watch` ile başlatır, dosya değişince yeniden başlar |
| `npm start` | Normal başlatır |
| `npm run seed` | `events` koleksiyonunu boşaltır ve 6 örnek etkinlik ekler (2'si geçmiş tarihli). Kaç kez çalıştırılırsa çalıştırılsın sonuçta 6 kayıt kalır. |

Testler: sunucu açıkken `newman run https://webdersi.vercel.app/test.json` (18 istek, 45 test). Son çalıştırmanın sonucu `requests/run-results.json` dosyasındadır.

## Klasör yapısı

```
backend/
  src/
    app.js                           Express uygulaması, middleware, route bağlama
    server.js                        .env okur, veritabanına bağlanır, portu dinler
    seed.js                          Örnek verileri veritabanına yükler
    config/database.js               MongoDB bağlantısı (MONGODB_URI'yi .env'den okur)
    models/event-model.js            Mongoose schema ve modeli (doğrulama kuralları)
    utils/date.js                    GG-AA-YYYY <-> Date dönüşümü, bugünün başı
    routes/event-routes.js           Hangi adres hangi fonksiyona gider
    controllers/event-controller.js  İsteği işler, veritabanıyla konuşur, yanıtı döndürür
    data/seed-events.js              Seed için örnek etkinlikler
  requests/
    kampus-api.json                  Postman collection
    run-results.json                 Collection Runner sonucu
  .env.example
  .gitignore
  package.json
```

## Veri modeli (Event)

| Alan | Tür | Kural |
| --- | --- | --- |
| `title` | String | zorunlu, boşluklar kırpılır, 3–100 karakter |
| `category` | String | zorunlu, `Seminer`, `Atölye`, `Söyleşi` veya `Yarışma` |
| `date` | Date | zorunlu. API'de **`GG-AA-YYYY`** (örn. `15-10-2026`), veritabanında gerçek tarih |
| `time` | String | isteğe bağlı, varsayılan boş |
| `location` | String | isteğe bağlı, boşluklar kırpılır |
| `description` | String | isteğe bağlı, en çok 500 karakter |
| `capacity` | Number | en az 0, varsayılan 0 |
| `createdAt`, `updatedAt` | Date | MongoDB/Mongoose otomatik ekler |

Her kaydın kimliği MongoDB'nin ürettiği `_id` alanıdır. Tarih veritabanında gerçek `Date` olduğu için doğru sıralanır ve `$gte` ile karşılaştırılır. Yanlış biçim (`2026-12-20`) ya da geçersiz gün (`31-02-2026`) 400 döner.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata |
| --- | --- | --- | --- | --- |
| GET | `/health` | Sunucu ayakta mı | 200 | — |
| GET | `/events` | Listeyi getir (`?search=` ve `?category=` ile filtrelenebilir) | 200 | — |
| GET | `/events/upcoming` | Bugün ve sonrası, tarihe göre sıralı | 200 | — |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 |
| POST | `/events` | Yeni etkinlik | 201 | 400 |
| PATCH | `/events/:id` | Gönderilen alanları güncelle | 200 | 400, 404 |
| DELETE | `/events/:id` | Sil | 204 (gövde yok) | 404 |

`/events/upcoming` route'u `/events/:id`'den **önce** tanımlıdır; aksi hâlde "upcoming" bir id sanılır.

### Status code'lar

- **200** tamam
- **201** oluşturuldu
- **204** içerik yok (silindi)
- **400** eksik/yanlış veri
- **404** bulunamadı (geçersiz ya da olmayan `_id` dahil)
- **500** beklenmeyen sunucu hatası

### Hata biçimi

Bütün hatalar aynı biçimdedir:

```json
{ "error": { "message": "Event not found" } }
```

### Örnekler

**GET /health** → `200`

```json
{ "status": "ok", "time": "2026-11-25T07:00:00.000Z", "student": "2416501032" }
```

**GET /events?search=atölye&category=Atölye** → `200`

`search` başlıkta büyük/küçük harf fark etmeden arar, `category` tam eşleşir. İkisi birlikte kullanılabilir.

```json
[
  {
    "_id": "6b067d2879040e355d779447",
    "title": "Sokak Fotoğrafçılığı Atölyesi",
    "category": "Atölye",
    "capacity": 25,
    "date": "03-12-2026",
    "time": "10:00",
    "location": "Kampüs Topluluk Odası",
    "description": "...",
    "createdAt": "2026-11-25T06:16:08.168Z",
    "updatedAt": "2026-11-25T06:16:08.168Z"
  }
]
```

**GET /events/upcoming** → `200`

Bugün ve sonraki etkinlikler, en yakın tarih önce. Geçmiş tarihli etkinlikler listede yer almaz.

**GET /events/:id** → `200` (`:id` yerine listeden aldığın `_id` yazılır)

**GET /events/yok** veya veritabanında olmayan bir `_id` → `404`

```json
{ "error": { "message": "Event not found" } }
```

**POST /events** (Body: raw JSON) → `201`

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "date": "20-12-2026",
  "capacity": 30
}
```

Yanıt, kaydın `_id`, `createdAt` ve `updatedAt` alanlarıyla birlikte hâlidir. `title`, `category` ve `date` zorunludur.

**POST /events** (sadece `title`) → `400`

```json
{ "error": { "message": "Event validation failed: category: Path `category` is required., date: Path `date` is required." } }
```

**POST /events** (yanlış tarih biçimi: `"date": "2026-12-20"`) → `400`

**PATCH /events/:id** (Body: `{ "capacity": 55 }`) → `200`

Sadece gönderilen alanlar değişir, yanıtta güncel kayıt döner. Kurallar güncellemede de geçerlidir.

| Body | Sonuç |
| --- | --- |
| `{ "capacity": 55 }` | 200, sadece `capacity` değişir |
| `{ "title": " Yeni Başlık " }` | 200, `"Yeni Başlık"` (boşluklar kırpılır) |
| `{}` | 400 `Body is empty` |
| `{ "category": "Parti" }` | 400 (geçersiz kategori) |
| `{ "_id": "abc" }` | 400 `_id cannot be changed` |
| `{ "date": "25-12-2026" }` | 200, tarih güncellenir |
| geçersiz ya da olmayan `:id` | 404 |

**DELETE /events/:id** → `204` (gövde yok)

Aynı id ile ikinci istek, geçersiz ya da olmayan `:id` → `404`.