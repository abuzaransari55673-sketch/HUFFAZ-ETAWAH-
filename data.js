/**
 * HUFFAZ ETAWAH - Deen & Bayanaat
 * Centralized Data Module & Local Content Store
 * Offline-ready Islamic media and education content
 */

const HUFFAZ_DATA = {
  appInfo: {
    name: "HUFFAZ ETAWAH",
    subtitle: "Deen & Bayanaat",
    tagline: "Ilm • Ibadat • Tarbiyah",
    description: "Official Islamic media and educational platform publishing authentic Bayanaat, Jumma Khutbas, Deeni Taleem, Quranic Quizzes, and Children's learning modules.",
    channelName: "HUFFAZ ETAWAH Official",
    youtubeUrl: "https://www.youtube.com",
    instagramUrl: "https://www.instagram.com",
    whatsappUrl: "https://whatsapp.com/channel",
    locationDefault: "Etawah, Uttar Pradesh, India",
    version: "2.5.0",
    developerNote: "All content strictly curated with authentic Quran & Sunnah references."
  },

  // Daily Islamic Content (Rotates daily or manual fallback)
  dailyContent: {
    ayat: {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "Inna ma'al 'usri yusra",
      urdu: "Beshak mushkil ke saath aasaani hai.",
      english: "Indeed, with hardship comes ease.",
      reference: "Surah Ash-Sharh (94:6)",
      topic: "Sabr aur Umeed",
      tafseer: "Har takleef aur aazmaish ke baad Allah Ta'ala aasaani aur barkat ata farmate hain. Momin ko kabhi mayoos nahi hona chahiye."
    },
    hadith: {
      arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      transliteration: "Khayrukum man ta'allamal-Qur'ana wa 'allamah",
      urdu: "Tum mein sab se behtar shakhs wo hai jis ne Quran seekha aur doosron ko sikhaya.",
      english: "The best among you are those who learn the Quran and teach it.",
      reference: "Sahih Al-Bukhari (Hadith 5027)",
      narrator: "Hazrat Uthman ibn Affan (R.A.)",
      topic: "Quran ki Fazeelat"
    },
    dua: {
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidnee 'ilma",
      urdu: "Aye mere Rab! Mere ilm mein izafa farma.",
      english: "O my Lord! Increase me in knowledge.",
      reference: "Surah Taha (20:114)",
      occasion: "Dars aur Padhai ke waqt",
      benefit: "Ilm mein pukhtagi aur Zehan mein roshni ke liye yeh dua kasrat se padhein."
    }
  },

  // Bayanaat Library with YouTube integration
  bayanaat: [
    {
      id: "bayan-1",
      title: "Sabr Kab Tak? Haq Ke Liye Kitna Sabr Zaroori Hai?",
      scholar: "Maulana Jarjees Ansari Hafizahullah",
      category: "Khaas Bayan",
      date: "28 August 2026",
      duration: "48:20",
      youtubeId: "dQw4w9WgXcQ", // Replaceable with real ID
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
      views: "128K",
      description: "Zindagi ki aazmaishon mein Sabr ki ahmiyat aur Nabiyon ke sabr ki misaalein. Ek pur-asar aur imaan-afroz bayan.",
      featured: true
    },
    {
      id: "bayan-2",
      title: "Amal-e-Saleh Kya Hai? Jannat Ka Raasta Kaise Milega?",
      scholar: "Maulana Jarjees Ansari Hafizahullah",
      category: "Jumma Khutba",
      date: "30 August 2026",
      duration: "35:15",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80",
      views: "95K",
      description: "Nek aamaal ki qabooliyat ki sharait aur Ikhlas-e-Niyyat par mustanad guftagu.",
      featured: true
    },
    {
      id: "bayan-3",
      title: "Namaz Mein Khushoo Aur Khuzoo Kaise Paida Karein?",
      scholar: "Maulana Jarjees Ansari Hafizahullah",
      category: "Dars",
      date: "22 August 2026",
      duration: "42:10",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80",
      views: "210K",
      description: "Namaz mein dil lagane ke roohani aur amali nuskhe. Sajdon ki lazzat aur huzoori.",
      featured: false
    },
    {
      id: "bayan-4",
      title: "Walidain Ke Huqooq Aur Unki Khidmat Ka Inaam",
      scholar: "Maulana Jarjees Ansari Hafizahullah",
      category: "Ijtima",
      date: "15 August 2026",
      duration: "55:40",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&auto=format&fit=crop&q=80",
      views: "340K",
      description: "Maa Baap ki itaat aur unke aage jhukne ki barkat. Qayamat ke din ka hisaab.",
      featured: false
    },
    {
      id: "bayan-5",
      title: "Tawbah Ki Taqat - Gunahon Se Paak Hone Ka Raasta",
      scholar: "Maulana Jarjees Ansari Hafizahullah",
      category: "Khaas Bayan",
      date: "10 August 2026",
      duration: "38:50",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80",
      views: "185K",
      description: "Allah Ta'ala ki be-intaha rehmat aur sachi taubah ki sharait.",
      featured: false
    },
    {
      id: "bayan-6",
      title: "60 Seconds Mein SubhanAllah Kehne Ka Sawab #Shorts",
      scholar: "HUFFAZ ETAWAH Media",
      category: "Shorts",
      date: "01 September 2026",
      duration: "0:58",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
      views: "89K",
      description: "Meezan mein sab se bhaari kalima. Rozana padhein aur share karein.",
      featured: false
    },
    {
      id: "bayan-7",
      title: "Jumma Ke Din Surah Kahf Padhne Ki Fazilat #Shorts",
      scholar: "HUFFAZ ETAWAH Media",
      category: "Shorts",
      date: "29 August 2026",
      duration: "0:54",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80",
      views: "140K",
      description: "Do Jumma ke darmiyan noor ki roshni aur Fitna-e-Dajjal se hifazat.",
      featured: false
    }
  ],

  // Quiz-e-Deen (MCQ System with Islamic References)
  quizzes: [
    {
      id: "q-1",
      category: "Quran",
      question: "Quran Shareef mein kul kitni Suratein hain?",
      options: ["113", "114", "115", "116"],
      correctAnswer: 1, // index 1 = "114"
      explanation: "Quran Majeed mein kul 114 Suratein hain, jin mein 86 Makki aur 28 Madani Suratein hain.",
      reference: "Al-Itqan fi Ulum al-Quran (Imam Suyuti)"
    },
    {
      id: "q-2",
      category: "Quran",
      question: "Quran Majeed ki sab se badi Ayat (Ayat-ul-Kursi) kis Surah mein hai?",
      options: ["Surah Al-Imran", "Surah An-Nisa", "Surah Al-Baqarah", "Surah Al-Kahf"],
      correctAnswer: 2,
      explanation: "Ayat-ul-Kursi Surah Al-Baqarah ki Ayat number 255 hai, jise Quran ki azeem tareen aayat kaha gaya hai.",
      reference: "Sahih Muslim (Hadith 810) & Surah Al-Baqarah 2:255"
    },
    {
      id: "q-3",
      category: "Seerah",
      question: "Huzoor Nabi Kareem ﷺ kis Hijri saal mein Madina Munawwarah Hijrat farmaye?",
      options: ["1 Hijri (622 CE)", "2 Hijri (623 CE)", "5 Hijri (626 CE)", "10 Hijri (631 CE)"],
      correctAnswer: 0,
      explanation: "Nabi Kareem ﷺ Hazrat Abu Bakr Siddiq (R.A.) ke hamrah Makkah se Madina Hijrat farmaye jahan se Islami Calendar (Hijri) shuru hua.",
      reference: "Ar-Raheeq Al-Makhtum (Safiyur-Rahman Mubarakpuri)"
    },
    {
      id: "q-4",
      category: "Namaz",
      question: "Namaz mein kul kitne Faraiz (Arkaan o Sharait) hote hain?",
      options: ["10", "12", "14 (7 Kharij + 7 Dakhil)", "17"],
      correctAnswer: 2,
      explanation: "Namaz ke 14 Faraiz hote hain: 7 Sharait (Namaz se bahar ke faraiz) aur 7 Arkaan (Namaz ke andar ke faraiz).",
      reference: "Noor-ul-Idah & Fatawa Alamgiri"
    },
    {
      id: "q-5",
      category: "Ahadith",
      question: "Tamam Aamaal ka daromadar kis cheez par hai?",
      options: ["Maal par", "Niyyat par", "Taqat par", "Shohrat par"],
      correctAnswer: 1,
      explanation: "Hadees-e-Mubaraka hai: 'Innamal a'maalu bin-niyyaat' — Tamam aamaal ka daromadar niyyaton par hai.",
      reference: "Sahih Al-Bukhari (Hadith 1) & Sahih Muslim (Hadith 1907)"
    },
    {
      id: "q-6",
      category: "Prophets",
      question: "Kis Nabi ko 'Jadd-ul-Anbiya' (Peyghambaron ke Baap) kaha jata hai?",
      options: ["Hazrat Adam (A.S.)", "Hazrat Nooh (A.S.)", "Hazrat Ibrahim (A.S.)", "Hazrat Musa (A.S.)"],
      correctAnswer: 2,
      explanation: "Hazrat Ibrahim (Alaihis Salam) ki nasal se kasrat se Anbiya-e-Kiram tashreef laye, isliye aapko Jadd-ul-Anbiya kaha jata hai.",
      reference: "Qasas-ul-Anbiya (Ibn Kathir)"
    },
    {
      id: "q-7",
      category: "Deeniyat",
      question: "Islam ke Bunyadi Arkaan (Pillars of Islam) kitne hain?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      explanation: "Islam ke 5 sutoon hain: Shahadat (Kalima), Namaz, Roza, Zakat, aur Hajj.",
      reference: "Sahih Al-Bukhari (Hadith 8)"
    },
    {
      id: "q-8",
      category: "Quran",
      question: "Quran Majeed ki kis Surah ko 'Quran ka Dil' (Heart of Quran) farmaya gaya hai?",
      options: ["Surah Yaseen", "Surah Ar-Rahman", "Surah Al-Mulk", "Surah Al-Ikhlas"],
      correctAnswer: 0,
      explanation: "Hadees mein aata hai ke har cheez ka ek dil hota hai aur Quran Majeed ka dil Surah Yaseen hai.",
      reference: "Sunan At-Tirmidhi (Hadith 2887)"
    }
  ],

  // Deeni Taleem Modules
  taleemCategories: [
    {
      id: "noorani-qaida",
      title: "Noorani Qaida",
      icon: "menu_book",
      badge: "Bunyadi Tajweed",
      totalLessons: 12,
      description: "Huruf-e-Mufradat, Harkat, Tanween, Madd aur Huroof-e-Maddah ke sahi talaffuz ke asbaaq.",
      lessons: [
        {
          id: "nq-1",
          title: "Sabaq 1: Huroof-e-Mufradat (Alif se Yaa)",
          content: "Arabic letters: ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن و هـ ء ي.\nMakharij note: Huroof-e-Halqi (Halq se ada hone wale): ء هـ ع ح غ خ.",
          audioGuide: "Talaffuz ko narm aur saaf ada karein.",
          rules: "Huroof-e-Musta'liyah (Mote huroof): خ ص ض ط ظ غ ق."
        },
        {
          id: "nq-2",
          title: "Sabaq 2: Harkat (Zabar, Zair, Pesh)",
          content: "Zabar ( َ ), Zair ( ِ ), Pesh ( ُ ) ko 'Harkat' kehte hain.\nHarkat wale harf ko 'Mutaharrik' kehte hain. Isay bina kheenchain jaldi padhein.",
          rules: "Harkat ko kheenchna ya jhatka dena mana hai."
        },
        {
          id: "nq-3",
          title: "Sabaq 3: Tanween (Do Zabar, Do Zair, Do Pesh)",
          content: "Do Zabar, Do Zair, Do Pesh ko Tanween kehte hain. Tanween mein Noon-e-Sakin ki aawaz posheeda hoti hai.",
          rules: "Ghunna ke ahkaam: Izhar, Idgham, Iqlab, Ikhfa."
        }
      ]
    },
    {
      id: "namaz-guide",
      title: "Namaz ka Tareeqa",
      icon: "accessibility_new",
      badge: "Arkaan & Sunnats",
      totalLessons: 8,
      description: "Takbeer-e-Tehreema se lekar Salaam tak mukammal Sunnat ke mutabiq tareeqa.",
      lessons: [
        {
          id: "nz-1",
          title: "Wudhu ke 4 Faraiz aur Sunnatein",
          content: "Wudhu ke 4 Faraiz:\n1. Chehra dhona (Peshani ke baalon se thodhi ke neeche tak aur ek kaan ki lau se doosre tak).\n2. Dono haathon ko kohniyon samet dhona.\n3. Chauthai sar ka masah karna.\n4. Dono paanv takhnon samet dhona.",
          rules: "Mustahab: Qibla rukh baithna, Bismillah padhna, Miswak karna."
        },
        {
          id: "nz-2",
          title: "5 Waqt ki Namaz ki Rakatein",
          content: "• Fajr: 2 Sunnat-e-Mokkada + 2 Farz = 4\n• Dhuhr: 4 Sunnat + 4 Farz + 2 Sunnat + 2 Nafl = 12\n• Asr: 4 Sunnat-e-Ghair Mokkada + 4 Farz = 8\n• Maghrib: 3 Farz + 2 Sunnat + 2 Nafl = 7\n• Isha: 4 Sunnat + 4 Farz + 2 Sunnat + 2 Nafl + 3 Witr + 2 Nafl = 17",
          rules: "Jumma: 4 Sunnat + 2 Farz + 4 Sunnat + 2 Sunnat + 2 Nafl = 14"
        },
        {
          id: "nz-3",
          title: "Attahiyyaat, Durood-e-Ibrahim aur Dua-e-Masoora",
          content: "Attahiyyaat:\nالتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ...\nDurood-e-Ibrahim:\nاَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَّعَلٰى اٰلِ مُحَمَّدٍ...",
          rules: "Ash-hadu par ungli uthana aur Il-lallah par jhukana Sunnat hai."
        }
      ]
    },
    {
      id: "kalime",
      title: "6 Kalime",
      icon: "auto_stories",
      badge: "Arabic & Urdu",
      totalLessons: 6,
      description: "Pehla Kalima Tayyab se lekar Chhata Kalima Radd-e-Kufr tak ba-tarjuma.",
      lessons: [
        {
          id: "kl-1",
          title: "Pehla Kalima - Tayyab (Pakeezgi)",
          content: "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَّسُولُ اللهِ\n\nTarjuma: Allah ke siwa koi ibadat ke layaq nahi, Muhammad ﷺ Allah ke Rasool hain.",
          rules: "Yeh kalima Imaan ki bunyaad hai."
        },
        {
          id: "kl-2",
          title: "Doosra Kalima - Shahadat (Gawahi)",
          content: "أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ\n\nTarjuma: Main gawahi deta hoon ke Allah ke siwa koi mabood nahi, Wo akela hai, Uska koi shareek nahi, aur gawahi deta hoon ke Muhammad ﷺ Uske bande aur Rasool hain.",
          rules: "Rozana wudhu ke baad padhne par Jannat ke aathon darwaze khul jate hain."
        },
        {
          id: "kl-3",
          title: "Teesra Kalima - Tamjeed (Buzurgi)",
          content: "سُبْحَانَ اللهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ\n\nTarjuma: Allah paak hai, aur tamaam taareefein Allah hi ke liye hain, aur Allah ke siwa koi mabood nahi, aur Allah sab se bada hai. Aur gunaah se bachne ki taqat aur neki karne ki quwwat nahi magar Allah hi ki taraf se jo aali shaan aur azeem hai.",
          rules: "Tasbeeh-e-Fatima mein kasrat se padhein."
        },
        {
          id: "kl-4",
          title: "Chautha Kalima - Tawheed (Wahdaniyat)",
          content: "لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَّا يَمُوتُ أَبَدًا أَبَدًا، ذُو الْجَلَالِ وَالْإِكْرَامِ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
          rules: "Baazaar mein dakhil hone ke waqt padhne par 10 laakh nekiyan milti hain."
        }
      ]
    },
    {
      id: "masnoon-duain",
      title: "Masnoon Duain",
      icon: "favorite",
      badge: "Rozmarra ki Duayein",
      totalLessons: 10,
      description: "Subah-o-Shaam, Sone/Jagne, Khane-peene aur Masjid ki mustanad duaein.",
      lessons: [
        {
          id: "md-1",
          title: "Sone aur Uthne ki Dua",
          content: "Sone ki Dua:\nاَللّٰهُمَّ بِاسْمِكَ اَمُوْتُ وَاَحْيَا\nTarjuma: Aye Allah! Tere hi naam ke sath main marta (sota) hoon aur jeeta (jagta) hoon.\n\nUthne ki Dua:\nاَلْحَمْدُ لِلّٰهِ الَّذِيْ اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ",
          rules: "Daayein (Right) karwat par sona Sunnat hai."
        },
        {
          id: "md-2",
          title: "Baitul Khala (Washroom) aane jaane ki Dua",
          content: "Dakhil hone ki Dua (Baayan paanv pehle):\nاَللّٰهُمَّ اِنِّيْ اَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ\n\nNikalne ki Dua (Daayan paanv pehle):\nغُفْرَانَكَ، اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَذْهَبَ عَنِّي الْاَذٰى وَعَافَانِيْ",
          rules: "Parda aur qibla rukh na hone ka ehtemaam karein."
        },
        {
          id: "md-3",
          title: "Ghar Se Nikalne Aur Dakhil Hone Ki Dua",
          content: "Nikalne ki Dua:\nبِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ\n\nDakhil hone par:\nSalam karein aur Bismillah padhein.",
          rules: "Shaiteen se hifazat aur kifaayat ki zamanat."
        }
      ]
    },
    {
      id: "ahadith-mubaraka",
      title: "Muntakhab Ahadith",
      icon: "import_contacts",
      badge: "Sahi Sanad",
      totalLessons: 15,
      description: "Imaan, Ikhlaas, Huqooq-ul-Ibad aur Ikhlaqiyat par mustanad Hadees-e-Rasool ﷺ.",
      lessons: [
        {
          id: "hd-1",
          title: "Musulman Wo Hai Jiski Zubaan Aur Haath Se Doosre Mehfooz Hon",
          content: "قَالَ رَسُولُ اللهِ ﷺ: «الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ»\n\nTarjuma: Rasoolullah ﷺ ne farmaya: Musalman wo shakhs hai jiski zabaan aur uske haath se doosre Musalman mehfooz rahein.",
          rules: "Reference: Sahih Al-Bukhari (10), Sahih Muslim (40)"
        },
        {
          id: "hd-2",
          title: "Muskuraana Bhi Sadqah Hai",
          content: "قَالَ ﷺ: «تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ»\n\nTarjuma: Apne bhai ke saamne tumhara muskurana bhi tumhare liye Sadqah (Neki) hai.",
          rules: "Reference: Jami At-Tirmidhi (1956)"
        }
      ]
    },
    {
      id: "islamic-stories",
      title: "Islamic Stories (Qasas-ul-Anbiya)",
      icon: "history_edu",
      badge: "Ibrat & Sabaq",
      totalLessons: 8,
      description: "Hazrat Adam, Hazrat Nooh, Hazrat Ibrahim, Hazrat Musa aur Hazrat Isa (A.S.) ke waqiat.",
      lessons: [
        {
          id: "st-1",
          title: "Hazrat Ibrahim (A.S.) Aur Aag Ka Gulzaar Banna",
          content: "Jab Namrood ne Hazrat Ibrahim (A.S.) ko dawat-e-haq dene par badi aag mein daala, toh Allah Ta'ala ne aag ko hukum farmaya:\n«قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ»\n(Hum ne farmaya: Aye aag! Thandi aur salamati wali ban ja Ibrahim par). Aag phoolon ka baagh ban gayi.",
          rules: "Sabaq: Jo Allah par kamil bharosa (Tawakkul) rakhta hai, Allah uski har aafat se hifazat farmata hai."
        }
      ]
    },
    {
      id: "kids-learning",
      title: "HUFFAZ ETAWAH Kids",
      icon: "child_care",
      badge: "Kids Special",
      totalLessons: 10,
      description: "Bachon ke liye aasan Quran, Sunnat ke aadaab, Islamic manners aur dilchasp sawaal-jawab.",
      lessons: [
        {
          id: "kd-1",
          title: "Bismillah aur Khane Peene ke Sunnat Aadaab",
          content: "1. Khana khane se pehle dono haath dhona.\n2. 'Bismillah wa 'ala barakatillah' padhna.\n3. Daayein (Seedhe) haath se khana.\n4. Apne saamne se khana.\n5. Khana khatam karke 'Alhamdulillahillazi At'amana...' padhna.",
          rules: "Bachon ko interactive tareeqe se practice karwayein!"
        },
        {
          id: "kd-2",
          title: "Allah Kaun Hain? Hum Sabka Khaaliq",
          content: "Allah Ta'ala hum sab ke Paida karne wale hain. Unhone Zameen, Aasman, Chand, Sooraj aur sabhi ko banaya hai. Wo sab sunte aur dekhte hain.",
          rules: "Aqeedah ki aasan taleem for kids."
        }
      ]
    },
    {
      id: "maktab-lessons",
      title: "Maktab Lessons & Aqeedah",
      icon: "school",
      badge: "Darse Nizami Base",
      totalLessons: 8,
      description: "Imaan-e-Mufassal, Imaan-e-Mujmal, Farishton, Kitaabon aur Aakhirat par Imaan.",
      lessons: [
        {
          id: "mk-1",
          title: "Imaan-e-Mufassal (Tafseeli Imaan)",
          content: "آمَنْتُ بِاللهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَالْقَدْرِ خَيْرِهِ وَشَرِّهِ مِنَ اللهِ تَعَالَىٰ وَالْبَعْثِ بَعْدَ الْمَوْتِ\n\nTarjuma: Main Imaan laya Allah par, Uske farishton par, Uski kitaabon par, Uske Rasoolon par, Qayamat ke din par, aur is baat par ke achhi aur buri taqdeer Allah ki taraf se hai, aur maut ke baad doobara uthaye jaane par.",
          rules: "Yeh 7 bunyadi aqaid har Musalman par laazim hain."
        }
      ]
    }
  ],

  // Important Islamic Calendar Events
  islamicDates: [
    { name: "1st Muharram", event: "Islami Naya Saal (Hijri New Year)", desc: "Islami saal ka aaghaz" },
    { name: "10th Muharram", event: "Youm-e-Ashura", desc: "Roza rakhne ki azeem fazilat" },
    { name: "12th Rabi-ul-Awwal", event: "Milad-un-Nabi ﷺ", desc: "Rehmat-ul-Lil-Aalameen ki wiladat" },
    { name: "27th Rajab", event: "Shab-e-Meraj", desc: "Aasmani safar aur 5 Waqt Namaz ka tohfa" },
    { name: "15th Sha'ban", event: "Shab-e-Barat", desc: "Maghfirat aur Ibadat ki raat" },
    { name: "1st Ramadan", event: "Ramadan Mubarak ka Aaghaz", desc: "Rozon aur Quran ka mubarak maheena" },
    { name: "Aakhri Ashra Ramadan", event: "Laylat-ul-Qadr (21, 23, 25, 27, 29)", desc: "Hazaar maheenon se behtar raat" },
    { name: "1st Shawwal", event: "Eid-ul-Fitr", desc: "Khushiyon aur Shukr ka din" },
    { name: "8th-12th Dhul-Hijjah", event: "Ayyaam-e-Hajj", desc: "Fariza-e-Hajj ki adaigi" },
    { name: "10th Dhul-Hijjah", event: "Eid-ul-Adha", desc: "Sunnat-e-Ibrahimi (Qurbani)" }
  ],

  // Free/No-Key Default Cities & Timings (Hanafi/Karachi Calculation)
  defaultPrayerTimes: {
    city: "Etawah",
    state: "Uttar Pradesh",
    country: "India",
    latitude: 26.7769,
    longitude: 79.0238,
    timezone: "Asia/Kolkata",
    fajr: "04:42",
    sunrise: "05:58",
    dhuhr: "12:16",
    asr: "16:45",
    maghrib: "18:34",
    isha: "19:50"
  },

  // Popular Indian & International Cities for Quick Selection
  citiesList: [
    { name: "Etawah (HQ)", state: "Uttar Pradesh", country: "India", lat: 26.7769, lng: 79.0238 },
    { name: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 },
    { name: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lng: 80.9462 },
    { name: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.4499, lng: 80.3319 },
    { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lng: 78.0081 },
    { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lng: 72.8777 },
    { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lng: 78.4867 },
    { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lng: 88.3639 },
    { name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
    { name: "Dubai", state: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
    { name: "London", state: "England", country: "UK", lat: 51.5074, lng: -0.1278 }
  ]
};

if (typeof window !== "undefined") {
  window.HUFFAZ_DATA = HUFFAZ_DATA;
}
