(() => {
  if (window.__ksdtMenuReady) return;
  window.__ksdtMenuReady = true;

  const DATA = {"Temel Eğitim":[{"name":"Arapça - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1HwmBUi2GE_-8kpu9kJgo_gmXjxN_ddYJ1zZJ9Mu5rXk/edit?usp=sharing"},{"name":"Bilişim Teknolojileri ve Yazılım (Temel Eğitim)","url":"https://docs.google.com/spreadsheets/d/1SF0q_xCII0Ahju2BA6idiT2u-s02z8wSFrdxQA9-e_s/edit?usp=sharing"},{"name":"ÇYDEM Almanca (Temel Eğitim)","url":"https://docs.google.com/spreadsheets/d/1IJ2hWLZ0MOJzuqv1FBT0T_gCy_Trj_oQstZE3EkwCtU/edit?usp=sharing"},{"name":"ÇYDEM İngilizce (Temel Eğitim)","url":"https://docs.google.com/spreadsheets/d/1MEn51AfXPjrgil9yeN5T5Tebh-dZEKYRe1jSuqnGt-I/edit?usp=sharing"},{"name":"Din Kültürü ve Ahlak Bilgisi - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1tT--hgRMeY77mwxDlvSXG2e9YWsqm99wgC7ue6AG1LM/edit?usp=sharing"},{"name":"Fen Bilimleri - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1MggHE8lkFn8TuFF64R_CVsUrl9FBLrxmw05I7jTUvqw/edit?usp=sharing"},{"name":"İngilizce - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1VWafQZzmN9E7VKLDKA4xhGKa18ShOEI7Y7vn-U9N0NI/edit?usp=sharing"},{"name":"Matematik - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1mQTOsaDJalfHp4KVHuYaxf838aWxK359N3K19ooW03s/edit?usp=sharing"},{"name":"Sosyal Bilgiler - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1zu8L-ReI4RjWm-iIb6v5DFdoIX1Jgx7vG2eKfi5Wsb8/edit?usp=sharing"},{"name":"T.C. İnkılâp Tarihi ve Atatürkçülük - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1hHP5Kci2tw-qzTH3WfQYDdrp78_ya4k1M0WYl6kZOdQ/edit?usp=sharing"},{"name":"Türkçe - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1kIK1WCcqqKqINl7pA9t7z0EmgKUg5gOG9NyNgf-vrVE/edit?usp=sharing"},{"name":"Afet Bilinci","url":"https://docs.google.com/spreadsheets/d/1IAzzsGjYI4N8lh2_WEtQPaV7kxBGXhWt3OK6HlnN7NY/edit?usp=sharing"},{"name":"Ahlak ve Vatandaşlık Eğitimi","url":"https://docs.google.com/spreadsheets/d/1itWlSMmdmooG6SiaNbSFV3D7OHY-I_92hTP4ywqZccM/edit?usp=sharing"},{"name":"Bilim Uygulamaları","url":"https://docs.google.com/spreadsheets/d/1enRI1DzEctCp2kIGbSdvwg5xXreNY8hv7AmIBuXmnmY/edit?usp=sharing"},{"name":"Çevre Eğitimi ve İklim Değişikliği","url":"https://docs.google.com/spreadsheets/d/1wG2N4h6lFs1MAOKWoHuZpiDzPLmCPfplHAgj-nbisD4/edit?usp=sharing"},{"name":"Dijital Sanatlar","url":"https://docs.google.com/spreadsheets/d/14IMc6wfwZGHcKmDTsTTsm8-3N7TTOkNXwlmNENVmUvk/edit?usp=sharing"},{"name":"Düşünme Eğitimi","url":"https://docs.google.com/spreadsheets/d/1F8HkkeEYGyo-CV-4qE7mGCRVFsP1D2lN58oS7GseGV4/edit?usp=sharing"},{"name":"Görgü Kuralları ve Nezaket","url":"https://docs.google.com/spreadsheets/d/1gfKhn8xmAOaOTyJCahjTrRX01HQE73o-7jfnzUbhrDM/edit?usp=sharing"},{"name":"Hukuk ve Adalet","url":"https://docs.google.com/spreadsheets/d/1nNuv8GqVPiWXHjzlrxq84B6NKx8lAaexlzd5RGoyL-4/edit?usp=sharing"},{"name":"Kur'an-ı Kerim (Temel Eğitim)","url":"https://docs.google.com/spreadsheets/d/11Gr3MePU5HX4gSJyP8MpKR5IHXDIw1b9F6FSs4XUWmg/edit?usp=sharing"},{"name":"Kültür ve Medeniyetimize Yön Verenler","url":"https://docs.google.com/spreadsheets/d/16bOHC7iWxAYaSyboowsG14-V345N0XtC-sFK88QkBxA/edit?usp=sharing"},{"name":"Masal ve Destanlarımız","url":"https://docs.google.com/spreadsheets/d/1eXeH_lEluuUdfUK1h3jRLTdATIz2BDju9sAFmUSYOSU/edit?usp=sharing"},{"name":"Matematik Uygulamaları","url":"https://docs.google.com/spreadsheets/d/1iIGywsqIQEPXxM2LfOfwnAh9eJLwA2GoVYnHNa3IHMs/edit?usp=sharing"},{"name":"Medya Okuryazarlığı","url":"https://docs.google.com/spreadsheets/d/1dyQCrWlpRBVLzGyrIMpgkhaklaq_9cMRecwv38QdrVU/edit?usp=sharing"},{"name":"Okul Temelli Sosyal Sorumluluk Çalışmaları","url":"https://docs.google.com/spreadsheets/d/1Q3EpPedwh5xBMmO_1_lsax1woXTlA1A4-9kEe4ljfQU/edit?usp=sharing"},{"name":"Okuma Becerileri","url":"https://docs.google.com/spreadsheets/d/1FNNdUn6_rxPLGaCk7XZIktODqTx8zP64EIt9jofb1Mw/edit?usp=sharing"},{"name":"Peygamberimizin Hayatı (Temel Eğitim)","url":"https://docs.google.com/spreadsheets/d/1Rz7qy3plIcaCwnhikP0RXvR1l7Zv4cZ8QQtem8rnk6c/edit?usp=sharing"},{"name":"Proje Tasarımı ve Uygulamaları","url":"https://docs.google.com/spreadsheets/d/1pgLmYOL5cK6Xb7bPC7ucD7vnRjeZCdXTd83DLmn0usA/edit?usp=sharing"},{"name":"Robotik Kodlama","url":"https://docs.google.com/spreadsheets/d/11xctteWHmt6dY5l7JrXfUSBqxSqLD3TTZSyOmBfqR1A/edit?usp=sharing"},{"name":"Şehrimiz ...","url":"https://docs.google.com/spreadsheets/d/1L9BiDCu3AZh0MGMnGmy9fGlplAcL7M31Uo884kB9jc4/edit?usp=sharing"},{"name":"Temel Dinî Bilgiler","url":"https://docs.google.com/spreadsheets/d/13F4_wOlftmaegCFP7JgY1ZTP7-qlR3MpQtpVfcem84Q/edit?usp=sharing"},{"name":"Temel Yaşam Becerileri","url":"https://docs.google.com/spreadsheets/d/1j1FNlSX-S0R0kykUEJvPe-vvKB-0OvsgGLLJv5iEqpU/edit?usp=sharing"},{"name":"Türk Sosyal Hayatında Aile","url":"https://docs.google.com/spreadsheets/d/13T40Yl-0Bl1HWBY1nXIiWzibw838Bg9Kn-ntiV0IGdY/edit?usp=sharing"},{"name":"Yapay Zekâ Uygulamaları","url":"https://docs.google.com/spreadsheets/d/1BiwnDjqcrDbP9E1BszChkUwLaorHESOiONmGBJQyCoI/edit?usp=sharing"},{"name":"Yazarlık ve Yazma Becerileri","url":"https://docs.google.com/spreadsheets/d/13KUJqmp2i9mq94jpkMdT7JU_YHFMo3t9TfQc9QwqmM4/edit?usp=sharing"}],"Ortaöğretim":[{"name":"Almanca - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1c44E9YphVJda2wMdFC67b_sRye2O9U9L3fIyViSjgC8/edit?usp=sharing"},{"name":"Biyoloji - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1MV7GvsXLkW5X3kaHSJeZyNKl_V4LvjD3vfjf7-MBQWo/edit?usp=sharing"},{"name":"Coğrafya - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/16MqKH0fx67lQfcsCSutts2Z7DORyoUh8SH5FgZQ08zQ/edit?usp=sharing"},{"name":"Coğrafya (2 Saatlik) - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/10m1olufFQIp5_k75q3ZvSq5vwHzZ5vjNaEj9b6khqGM/edit?usp=sharing"},{"name":"Coğrafya (4 Saatlik) - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1fNjLe2-55BFYsR09AvpZLAo5Ul9RCNWx6pNfT4c9NM8/edit?usp=sharing"},{"name":"Din Kültürü Ve Ahlak Bilgisi - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1wRGTqs3urgTKDfXZFwfaglsAH7LzBKNdgK9xOd37TkM/edit?usp=sharing"},{"name":"Fizik - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1JpML_cUfpitx6jSjmJ6pPEPZN9wjd02lGKfsuGLleNs/edit?usp=sharing"},{"name":"İngilizce - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/19uw5YpqpySaucR4KCR0uHwXbijxMYfDIzD4xc680MjM/edit?usp=sharing"},{"name":"Kimya - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1GV1WxjM_HQ0Wg_XFRsQ0PDB57h_hC3INt1eL4a2Aez8/edit?usp=sharing"},{"name":"Matematik - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1vs5Ha_NTVlLpyZA6dNMlfSAgqWY6EibdRZvRk5UsGe0/edit?usp=sharing"},{"name":"T.C. İnkılâp Tarihi Ve Atatürkçülük - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1rhCVNc0H_EsPRjI61BmOXlC0S10r5mOvmz2iPvWCyOU/edit?usp=sharing"},{"name":"Tarih - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1k3YTDcbjzvBDQg4eQtcHxKSsfODk654Dhse4IWVCG3o/edit?usp=sharing"},{"name":"Türk Dili Ve Edebiyatı - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1PFo__NuXQW-EjJta2BbJime9ANBOnqiBRGYgBBqgct4/edit?usp=sharing"},{"name":"Adabımuaşeret","url":"https://docs.google.com/spreadsheets/d/1SguKtyBHqiuJzZTNZ8TrWJ5SNoLxI3Wmz2rdlMG04_4/edit?usp=sharing"},{"name":"Astronomi ve Uzay Bilimleri","url":"https://docs.google.com/spreadsheets/d/1LjNLdPzgwHKe6QCJKjY8HmmjLiLfAxVxzFUTtD40pCw/edit?usp=sharing"},{"name":"Astronomi ve Uzay Bilimleri - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1CjRe8MILKgBwwfEKaUcIQQkUoh6kDJdI7mXPJZ_LG0Y/edit?usp=sharing"},{"name":"Çağdaş Türk ve Dünya Tarihi (2 Ders Saati) - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1PwIBTrCY1JFF16EQyvhCF1dnGc9yLB4OcoOYfSoJ4vQ/edit?usp=sharing"},{"name":"Çağdaş Türk ve Dünya Tarihi (4 Ders Saati) - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1OtcNYA--dtdl61HlWIFWZZqMlLRVxWzKNQyikX36P1U/edit?usp=sharing"},{"name":"Felsefe - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1mhxJlPg4j0Ac5eFyHa-pdQNMjBl_MPIdtdEhQ6YDUIk/edit?usp=sharing"},{"name":"İklim, Çevre ve Yenilikçi Çözümler - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/10MU0GzsjZlrf-jyZ7_wM6eMOsRcApNeHYnzHu6UDkxc/edit?usp=sharing"},{"name":"Kur’an-ı Kerim","url":"https://docs.google.com/spreadsheets/d/1Cp9iXMLUgodZuQplSi-asLXRIXDcqsOt6cf4eU4H-Oo/edit?usp=sharing"},{"name":"Mantık - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1ibCtJ_I3D9-eRgv9d4sl0vAR67FZpEiuZbdJBi21j0o/edit?usp=sharing"},{"name":"Matematik Uygulamaları I - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1jFvZx46qSa-OBNN2RTfuxbENJtdVN3clpOfIvpquFdE/edit?usp=sharing"},{"name":"Matematik Uygulamaları II - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/18ooAXfsWV18vLHyRfNjUGGg3JKN4_KhgAdHuVjWSC4E/edit?usp=sharing"},{"name":"Peygamberimizin Hayatı","url":"https://docs.google.com/spreadsheets/d/1Q9g07JwHoXaXF161J6_bXjJT4yLk7FhX_Ag5H9MVHhM/edit?usp=sharing"},{"name":"Psikoloji - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1DXoWOtAkRJnY3qxW4lbtBUQ3dGsJ0Gu0w8OHkitrfnI/edit?usp=sharing"},{"name":"Sağlık Bilgisi ve Trafik Kültürü - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/14LxyUH86NEezDglMVOiCVa4XUSRzvVRzpHrWbNwGS1Y/edit?usp=sharing"},{"name":"Sosyoloji - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1hr4GlnzgJoOQ9yZLYJ0oQyybDeAijKdP_12BwTTN9EE/edit?usp=sharing"},{"name":"Temel Dinî Bilgiler - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1UXce65pvsy2FijqTH9TIRiVFehbk1BGuRQF2LI0CI5o/edit?usp=sharing"},{"name":"Temel Matematik - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1mk0nKyJkYBBSzhsDqkCqYLRfmA0Zp5AmT4VjumfrKTs/edit?usp=sharing"},{"name":"Türk Kültür ve Medeniyet Tarihi","url":"https://docs.google.com/spreadsheets/d/1RB-ZLZq9kM6cUTB_4PrrlxS-KJ91ZcBVf9qAd_XWhD8/edit?usp=sharing"}],"İHL Dersleri":[{"name":"Akaid - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/10fEi6dLfh8mU1KE5KMlGeKJiYml4LxtwfwDFOMIoJ6g/edit?usp=sharing"},{"name":"Arapça - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/10UsP7Dd2C_Ppj3qbtsufXGQ6xwK8n_YGzBD1rQCdiYs/edit?usp=sharing"},{"name":"Dinler Tarihi - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1UcZcMUL9MtBmjsCryrC9MF1G_1fwOjhNHre92kxqLTw/edit?usp=sharing"},{"name":"Fıkıh - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1L3FHzSQLU1a8-MyQz_fYRR8UJ4xdyZFN_hYbHteofT8/edit?usp=sharing"},{"name":"Hadis - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1P08n2XisPTz3hsQ9X6eZM15dn3pY8NblcGwFR9nYmJ0/edit?usp=sharing"},{"name":"Hitabet ve Mesleki Uygulama - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1KYAT1nKcB14GnRJhZQhM17Kd2E3LQ-mEyFgyXigaDws/edit?usp=sharing"},{"name":"İslam Kültür ve Medeniyeti - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/13G_IiaEeGhMkCNeZ97SE_xziMNXklTv-GxXcnnhonf4/edit?usp=sharing"},{"name":"Kelam - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1Duqy39J-8SJ2Y77Lrpo_P-XGkfJ1v4WASFdryxCMRMs/edit?usp=sharing"},{"name":"Kur’an-ı Kerim (İHL) - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/183nWZoueasNt-91JwbwZrtC8lScDGyGj4n0Z9YBR8lg/edit?usp=sharing"},{"name":"Mesleki Arapça - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1vu1cGasZVmtlccMfbLAMaerd10wJejGeEO9bzepAwhA/edit?usp=sharing"},{"name":"Siyer - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/19edvH05aJvoOOJWqud40CG2rae-VK64Fsqe3bZ0zgSE/edit?usp=sharing"},{"name":"Tefsir - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1pQe-fP90oR1mzXuYUULHB_aruETIIl9m5deROUivC18/edit?usp=sharing"},{"name":"Temel Dinî Bilgiler AİHL - Konu Soru Dağılım Tablosu","url":"https://docs.google.com/spreadsheets/d/1vggzFdBrWH1_JgrbmKO6hLhjnAAWZ5SbKnIw9sE4qgQ/edit?usp=sharing"}],"Mesleki Eğitim":[{"name":"Mesleki Eğitim Bilişim Teknolojileri Alanı 10. Sınıf","url":"https://docs.google.com/spreadsheets/d/1zu2qBN9qwyCoPKJEZr1m-dKuDJ4s66P0TYi0rsxMeLI/edit?usp=sharing"},{"name":"Mesleki Eğitim Bilişim Teknolojileri Alanı 11-12. Sınıf","url":"https://docs.google.com/spreadsheets/d/10_655VdSufiXSL6g8QTKbiFXJIVQl90aqHPpYCd2rHY/edit?usp=sharing"},{"name":"Mesleki Eğitim Bilişim Teknolojileri Alanı 11. Sınıf","url":"https://docs.google.com/spreadsheets/d/186cwUcHhVwJMJiydD_lcWJKylBVfkARQq8zOoI4NFaQ/edit?usp=sharing"},{"name":"Mesleki Eğitim Bilişim Teknolojileri Alanı 9. Sınıf","url":"https://docs.google.com/spreadsheets/d/1a_90VYuZ1NsC1J9NN28H76nlyeck2Zm3zUeGkFplgbM/edit?usp=sharing"},{"name":"Mesleki Eğitim Çocuk Gelişimi Ve Eğitimi Alanı 10. Sınıf","url":"https://docs.google.com/spreadsheets/d/1INM7xWegees6kJs6az4HeqMhtPTzA1TdkGBtT6jXx98/edit?usp=sharing"},{"name":"Mesleki Eğitim Çocuk Gelişimi Ve Eğitimi Alanı 11-12. Sınıf","url":"https://docs.google.com/spreadsheets/d/1TNL56ypxX1nbGF9c_QDOYjCNVBdXb6yoaVpDWGeHntk/edit?usp=sharing"},{"name":"Mesleki Eğitim Çocuk Gelişimi Ve Eğitimi Alanı 11. Sınıf","url":"https://docs.google.com/spreadsheets/d/1Smw0zqBoAbYPUQjFlkWxcZ8lHrZ-3D-CSbUuu9ZK_ow/edit?usp=sharing"},{"name":"Mesleki Eğitim Çocuk Gelişimi Ve Eğitimi Alanı 12. Sınıf","url":"https://docs.google.com/spreadsheets/d/1prpYJMEETyl4tlqXu8NOcNjn0K60TBFhrJM3sa0D4u8/edit?usp=sharing"},{"name":"Mesleki Eğitim Çocuk Gelişimi Ve Eğitimi Alanı 9. Sınıf","url":"https://docs.google.com/spreadsheets/d/1zA8bb4U_MSm_Z39Ye0w-Ktwjwa2JkJe9MdAQYvFKP2c/edit?usp=sharing"},{"name":"Mesleki Eğitim Elektrik-Elektronik Teknolojisi Alanı 10. Sınıf","url":"https://docs.google.com/spreadsheets/d/1Lwg1hbhcjqoIgoM6bsXc_fzSZvNKxntdTqrOJ6aZDoY/edit?usp=sharing"},{"name":"Mesleki Eğitim Elektrik-Elektronik Teknolojisi Alanı 11-12. Sınıf","url":"https://docs.google.com/spreadsheets/d/1YD2te223tIGZZ1FaLgZzN0mxj_6CEdlKH4fJRWirj7g/edit?usp=sharing"},{"name":"Mesleki Eğitim Elektrik-Elektronik Teknolojisi Alanı 11. Sınıf","url":"https://docs.google.com/spreadsheets/d/17zhzgbxbgyNgwCt_E2-hbWgdtt4PpV6Di0fiBUlFCNQ/edit?usp=sharing"},{"name":"Mesleki Eğitim Elektrik-Elektronik Teknolojisi Alanı 12. Sınıf","url":"https://docs.google.com/spreadsheets/d/1ANHKjkyVb5k4ucF81Ts5IiVzW3Ad-BtDnsXGgyShCJs/edit?usp=sharing"},{"name":"Mesleki Eğitim Elektrik-Elektronik Teknolojisi Alanı 9. Sınıf","url":"https://docs.google.com/spreadsheets/d/1XOKx8ZxbzuwI4td9AhEEPbyWXtHIvwrZELqnF9qRNlA/edit?usp=sharing"}]};

  const style = document.createElement('style');
  style.textContent = `
    .ksdt-menu-btn{background:#fff7ed!important;color:#9a3412!important;border:1px solid #fed7aa!important}
    #ksdtPanel{position:fixed;inset:0;z-index:9997;background:#f6f8fb;display:none;overflow:auto;color:#0f172a}
    #ksdtPanel.show{display:block}
    .ksdt-head{position:sticky;top:0;z-index:5;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:max(14px,env(safe-area-inset-top)) 16px 14px;box-shadow:0 4px 18px rgba(15,23,42,.18)}
    .ksdt-head-inner{max-width:820px;margin:auto;display:flex;align-items:center;gap:12px}
    .ksdt-close{width:40px;height:40px;flex:0 0 40px;border:0;border-radius:11px;background:rgba(255,255,255,.14);color:#fff;font-size:22px;font-weight:900;cursor:pointer}
    .ksdt-title{font-size:18px;font-weight:900;line-height:1.2}
    .ksdt-sub{font-size:11px;opacity:.78;margin-top:3px}
    .ksdt-wrap{max-width:820px;margin:auto;padding:14px 14px 32px}
    .ksdt-level{background:#fff;border:1px solid #e2e8f0;border-radius:14px;margin:10px 0;overflow:hidden;box-shadow:0 5px 16px rgba(15,23,42,.045)}
    .ksdt-level-btn{width:100%;border:0;background:#fff;color:#0f172a;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;cursor:pointer}
    .ksdt-level-name{font-size:14px;font-weight:900}
    .ksdt-count{font-size:11px;font-weight:800;color:#64748b;background:#f1f5f9;padding:5px 8px;border-radius:999px;margin-left:auto}
    .ksdt-chevron{font-size:18px;color:#64748b;transition:transform .18s ease}
    .ksdt-level.open .ksdt-chevron{transform:rotate(180deg)}
    .ksdt-courses{display:none;border-top:1px solid #e2e8f0;padding:7px}
    .ksdt-level.open .ksdt-courses{display:block}
    .ksdt-course{display:flex;align-items:center;gap:9px;width:100%;text-decoration:none;color:#1e293b;background:#fff;border:1px solid transparent;border-radius:10px;padding:10px 9px;font-size:12px;font-weight:700;line-height:1.32}
    .ksdt-course:hover,.ksdt-course:focus{background:#eff6ff;border-color:#bfdbfe;outline:none}
    .ksdt-course-icon{flex:0 0 auto;width:24px;height:24px;border-radius:7px;background:#eef2ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900}
    .ksdt-course-arrow{margin-left:auto;color:#94a3b8;font-size:15px}
    body.ksdt-open{overflow:hidden!important}
    @media(min-width:700px){.ksdt-title{font-size:20px}.ksdt-course{font-size:13px;padding:11px 10px}}
  `;
  document.head.appendChild(style);

  function build() {
    const actions = document.getElementById('sideMenuActions');
    if (!actions || document.getElementById('ksdtMenuBtn')) return false;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'ksdtMenuBtn';
    btn.className = 'caltools-btn ksdt-menu-btn';
    btn.textContent = 'Konu Soru Dağılım Tabloları';
    actions.appendChild(btn);

    const panel = document.createElement('section');
    panel.id = 'ksdtPanel';
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML = `
      <div class="ksdt-head"><div class="ksdt-head-inner">
        <button class="ksdt-close" id="ksdtClose" type="button" aria-label="Kapat">←</button>
        <div><div class="ksdt-title">Konu Soru Dağılım Tabloları</div><div class="ksdt-sub">Eğitim kademesini ve ardından dersi seçin</div></div>
      </div></div>
      <div class="ksdt-wrap" id="ksdtWrap"></div>`;
    document.body.appendChild(panel);

    const wrap = panel.querySelector('#ksdtWrap');
    Object.entries(DATA).forEach(([level,courses]) => {
      const section = document.createElement('div');
      section.className = 'ksdt-level';
      const head = document.createElement('button');
      head.type = 'button';
      head.className = 'ksdt-level-btn';
      head.innerHTML = `<span class="ksdt-level-name"></span><span class="ksdt-count"></span><span class="ksdt-chevron">⌄</span>`;
      head.querySelector('.ksdt-level-name').textContent = level;
      head.querySelector('.ksdt-count').textContent = `${courses.length} ders`;
      const list = document.createElement('div');
      list.className = 'ksdt-courses';
      courses.forEach(course => {
        const a = document.createElement('a');
        a.className = 'ksdt-course';
        a.href = course.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const icon = document.createElement('span'); icon.className = 'ksdt-course-icon'; icon.textContent = '↗';
        const text = document.createElement('span'); text.textContent = course.name;
        const arrow = document.createElement('span'); arrow.className = 'ksdt-course-arrow'; arrow.textContent = '›';
        a.append(icon,text,arrow);
        list.appendChild(a);
      });
      head.addEventListener('click', () => {
        const willOpen = !section.classList.contains('open');
        wrap.querySelectorAll('.ksdt-level.open').forEach(el => el.classList.remove('open'));
        if (willOpen) section.classList.add('open');
      });
      section.append(head,list);
      wrap.appendChild(section);
    });

    function openPanel() {
      document.getElementById('sideMenuClose')?.click();
      panel.classList.add('show');
      panel.setAttribute('aria-hidden','false');
      document.body.classList.add('ksdt-open');
      panel.scrollTop = 0;
    }
    function closePanel() {
      panel.classList.remove('show');
      panel.setAttribute('aria-hidden','true');
      document.body.classList.remove('ksdt-open');
    }
    btn.addEventListener('click', openPanel);
    panel.querySelector('#ksdtClose').addEventListener('click', closePanel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('show')) closePanel(); });
    return true;
  }

  if (!build()) {
    const observer = new MutationObserver(() => { if (build()) observer.disconnect(); });
    observer.observe(document.body, {childList:true,subtree:true});
    setTimeout(() => observer.disconnect(), 7000);
  }
})();
