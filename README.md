# React Native Tabanlı Odaklanma Takibi ve Raporlama Uygulaması (FocusApp)

## Proje Özeti
Bu projede, **React Native** ve **Expo** kullanılarak **FocusApp** isminde odaklanmaya yardımcı bir uygulama geliştirilmiştir. Uygulama, kullanıcının belirlediği kategorilerde 25 dakikalık (ayarlanabilir ) odaklanma seansları yapmasını sağlar. Uygulama AppState API kullanarak kullanıcının uygulamadan çıkıp çıkmadığını izleyebilir. Kullanıcı uygulama dışına çıktığında sistem bunu otomatik algılar, sayacı durdurur ve bu durumu kayıt altına alır. Veri kalıcılığı yerel veritabanı ile sağlanmış olup, kullanıcı performansı detaylı grafiklerle (Pasta ve Çubuk grafikler) raporlanmaktadır.

## Projedeki Konsept ve Gereksinimler

### 1. Dinamik Zamanlayıcı ve Kategori Yönetimi
- Sistem, varsayılan olarak odaklanma süresini yönetir ve geri sayım yapar.
- Kullanıcılar, çalışma alanlarına göre (Örn: Yazılım, Kitap, Spor) kategori seçimi yapabilir.
- **Dinamik CRUD Yapısı:** Kullanıcılar sisteme istedikleri kadar yeni kategori ekleyebilir veya mevcut olanları silebilir. Bu tercihler kalıcı olarak hafızada tutulur.

### 2. AppState API İle Dikkat Dağınıklığı Takibi
- Uygulama, `AppState` API kullanarak cihazın durumunu anlık olarak dinler.
- Kullanıcı ders çalışma sırasında uygulamayı arka plana atarsa (Instagram'a girmek, ana ekrana dönmek vb.), sayaç güvenlik mekanizması tarafından durdurulur.
- Bu eylem, veritabanına "Dikkat Dağınıklığı" olarak işlenir ve kullanıcıya uyarı verilir.

### 3. Veri Kalıcılığı ve Depolama (Persistence)
- Uygulamada `AsyncStorage` kullanılarak yerel bir veritabanı yapısı kurulmuştur.
- Tamamlanan seanslar, toplam süreler, günlük istatistikler ve kullanıcı tarafından eklenen özel kategoriler cihaz kapatılsa dahi saklanır.

### 4. Raporlama ve Görselleştirme
- **İstatistik Kartları:** Günlük çalışma süresi, toplam odaklanma süresi ve toplam dikkat dağınıklığı sayısı anlık olarak hesaplanır.
- **Grafiksel Analiz:**
    - **Çubuk Grafik (Bar Chart):** Son 7 günün performans analizi görselleştirilir.
    - **Pasta Grafik (Pie Chart):** Hangi kategoriye ne kadar vakit ayrıldığı oransal olarak sunulur.

### 5. Kullanıcı Deneyimi (UX) ve Geri Bildirim
- **Haptik Geri Bildirim:** Seans başarıyla tamamlandığında `Expo Haptics` kütüphanesi ile cihaz titreşimi tetiklenir.
- **Responsive Arayüz:** `SafeAreaView` ve `ScrollView` entegrasyonu sayesinde çentikli ekranlar (Notch) ve farklı ekran boyutlarında (Tablet/Telefon) kusursuz görüntüleme sağlanır.

## Proje Mimarisi

Proje, **Separation of Concerns (İlgi Alanlarının Ayrımı)** prensibine uygun olarak; Mantık (Logic), Görüntü (UI) ve Veri (Data) katmanlarına ayrılmıştır.

```text
src/
├── components/       # UI Bileşenleri (Presentational Layer)
│   ├── home/         # Ana Sayfa parçaları (Timer, Selector vb.)
│   └── reports/      # Rapor Ekranı parçaları (Charts, StatsGrid vb.)
├── hooks/            # Mantık Katmanı (Business Logic Layer)
│   └── useFocusTimer.js  # Tüm sayaç, kategori ve veritabanı mantığını yöneten Custom Hook
├── screens/          # Ekran Düzenleri (Container Layer)
│   ├── HomeScreen.js
│   └── ReportsScreen.js
└── utils/            # Yardımcı Servisler
    ├── storage.js    # Veritabanı (AsyncStorage) işlemleri
    └── helpers.js    # Formatlama fonksiyonları
```

## Kullanılacak Teknolojiler

- **Platform:** React Native (Expo SDK 50+)
- **Dil:** JavaScript (ES6+)
- **UI Framework:** NativeWind (Tailwind CSS)
- **Veritabanı:** @react-native-async-storage/async-storage
- **Grafik Kütüphanesi:** React Native Chart Kit
- **Navigasyon:** React Navigation (Bottom Tabs)
- **Donanım API'leri:** Expo Haptics (Titreşim), AppState (Durum Kontrolü)

## Projenin Hedefleri

- Uygulama, modern ve kullanıcı dostu bir **front-end** arayüze sahip olacaktır.
- Kod yapısı, spagetti koddan uzak, **Custom Hooks** kullanılarak modüler ve yeniden kullanılabilir (Reusable) yapıda olacaktır.
- **Güvenli Alan (Safe Area)** yönetimi ile donanımsal farklılıklar (kamera çentiği vb.) arayüzü bozmayacaktır.
- **Validasyonlar:** Kullanıcının süre bitmeden sayacı tekrar başlatması veya olmayan bir kategoriyi silmesi gibi durumlar engellenecektir.
- Veriler, uygulama kapatılıp açıldığında kaybolmayacak şekilde **yerel diskte** saklanacaktır.