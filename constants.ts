import { CVData, SectionType } from './types';

export const INITIAL_DATA: CVData = {
  template: 'modern',
  themeColor: '#2563eb', // Blue-600
  personalInfo: {
    fullName: 'Ekrem Değirmenci',
    title: 'Veri Yönetimi Uzmanı',
    email: 'ekremregister@gmail.com',
    phone: '+90 535 446 53 89',
    location: '',
    linkedin: 'https://linkedin.com/in/ekrem-degirmenci',
    website: '',
    summary: 'Yükseköğretim kurumlarında ve araştırma şirketlerinde veri yönetimi, metadata tasarımı, veri yaşam döngüsü (data lifecycle) ve analitik raporlama alanlarında uzmanlaşmış bir veri yönetimi danışmanıyım. Python, SQL, Power BI, Excel (ileri) ve SPSS ile büyük veri setlerinde veri temizleme, standardizasyon, veri bütünlüğü sağlama ve karar destek modelleri üretme konularında deneyime sahibim. IPSOS ve Girne Amerikan Üniversitesi deneyimlerimde; çok ülkeli birey verileri üzerinde veri harmonizasyonu, risk matrisi uygulamaları, SWOT analizi, veri güvenliği (KVKK/GDPR) ve stratejik akademik raporlama süreçlerini yürüttüm.'
  },
  sections: [
    {
      id: 'sec_exp',
      type: SectionType.EXPERIENCE,
      title: 'Deneyim',
      items: [
        { 
          id: '1', 
          title: 'Veri Yönetimi Danışmanı', 
          subtitle: 'Bağımsız / Freelance', 
          date: '2025 - Günümüz', 
          description: '• Power BI ve Excel ile özet panolar, etki analizleri ve karar destek raporları oluşturdu.\n• Kurumsal veri akışlarını düzenlemek için metadata şemaları, veri kategorileri, veri yaşam döngüsü ve data governance ilkelerine uygun modeller tasarladı.\n• Python, SQL, Power BI ve Excel ile veri temizleme, standardizasyon, veri bütünlüğü ve kalite kontrol süreçleri yürüttü.\n• Google Cloud ve homelab ortamlarında data storage – access monitoring süreçlerini yapılandırdı.\n• GDPR/KVKK uyumlu veri sınıflandırması ve saklama politikaları geliştirdi.\n• n8n ve Python ile otomatik veri pipeline’ları kurdu.' 
        },
        { 
          id: '2', 
          title: 'Data Executive', 
          subtitle: 'IPSOS', 
          date: '2022 - 2025', 
          description: '• 12 ülkeye ait birey veri setlerinde data management, veri entegrasyonu, metadata düzenleme ve veri harmonizasyonu süreçlerini yürüttü.\n• Regresyon, korelasyon, segmentasyon, K-Means, Naive Bayes gibi analitik yöntemler uyguladı.\n• Analitik modeller için güvenilir veri akışı sağlamak amacıyla metadata temizliği ve veri kalite kontrolü yaptı.\n• Python, SPSS, Excel ve Power BI ile üst yönetime sunulan dashboard’lar hazırladı.' 
        },
        { 
          id: '3', 
          title: 'Kurumsal Veri Yönetimi ve Raporlama Uzmanı', 
          subtitle: 'Girne Amerikan Üniversitesi', 
          date: '2019 - 2022', 
          description: '• Akademik ve idari süreç verilerinin toplanması, temizlenmesi, saklanması ve raporlanması süreçlerini yönetti.\n• Metadata tasarımı ve data governance yapılarını entegre etti.\n• Stratejik akademik raporlar ve performans analizleri oluşturdu.\n• KVKK uyumlu veri güvenliği mimarisi kurarak rol tabanlı erişim politikaları tasarladı.' 
        },
        { 
          id: '4', 
          title: 'İnsan Kaynakları Raporlama Stajyeri', 
          subtitle: 'Haribo', 
          date: '2017', 
          description: '• Personel verilerini işledi, doğruladı ve Excel tabanlı raporladı.\n• Veri bütünlüğünü korumak için rutin kalite kontrolleri gerçekleştirdi.' 
        },
        { 
          id: '5', 
          title: 'İnsan Kaynakları Stajyeri', 
          subtitle: 'Merit Park Hotel', 
          date: '2017', 
          description: '• Personel veri kayıtlarının dijitalleştirilmesi ve arşivlenmesine destek verdi.\n• Excel tabanlı veri hazırlığı ve raporlama süreçlerine katkı sağladı.' 
        }
      ]
    },
    {
      id: 'sec_edu',
      type: SectionType.EDUCATION,
      title: 'Eğitim',
      items: [
         { id: '10', title: 'Girne Amerikan Üniversitesi', subtitle: 'MBA (İngilizce)', date: 'Tez aşaması', description: '' },
         { id: '11', title: 'Orta Doğu Teknik Üniversitesi', subtitle: 'Psikoloji (İngilizce)', date: '2012 - 2019', description: '' },
         { id: '12', title: 'Yakın Doğu Koleji', subtitle: 'Fen - Matematik (İngilizce)', date: '2005 - 2009', description: '' }
      ]
    },
    {
      id: 'sec_skills',
      type: SectionType.SKILLS,
      title: 'Teknik Yetkinlikler',
      items: [
        { id: '20', title: 'Python (Pandas, NumPy)' },
        { id: '21', title: 'SQL' },
        { id: '22', title: 'Power BI (DAX)' },
        { id: '23', title: 'Excel (Power Query, Pivot)' },
        { id: '24', title: 'SPSS' },
        { id: '25', title: 'Metadata Management' },
        { id: '26', title: 'Data Governance' },
        { id: '27', title: 'KVKK/GDPR' },
        { id: '28', title: 'n8n' },
        { id: '29', title: 'Git' }
      ]
    },
    {
      id: 'sec_certs',
      type: SectionType.CUSTOM,
      title: 'Uluslararası Sertifikalar',
      items: [
        { id: '30', title: 'Google Data Analytics Certificate', subtitle: 'Google' },
        { id: '31', title: 'IBM Applied Data Science', subtitle: 'IBM' },
        { id: '32', title: 'Microsoft Power BI Data Analyst', subtitle: 'Microsoft' },
        { id: '33', title: 'Lean Six Sigma White Belt', subtitle: '' },
        { id: '34', title: 'Psychological First Aid', subtitle: 'The National Child Traumatic Stress Network' }
      ]
    },
    {
      id: 'sec_lang',
      type: SectionType.LANGUAGES,
      title: 'Dil Becerileri',
      items: [
        { id: '40', title: 'Türkçe - Anadil' },
        { id: '41', title: 'İngilizce - İleri Seviye' }
      ]
    }
  ]
};