import { ListenItem } from "../types";

export const tagalogListening: ListenItem[] = [
  // GREETINGS
  { say: "Magandang umaga.", translation: "Good morning.", options: ["Magandang umaga.", "Magandang hapon.", "Magandang gabi."] },
  { say: "Kumusta ka?", translation: "How are you?", options: ["Kumusta ka?", "Kumusta siya?", "Kumusta kayo?"] },
  { say: "Mabuti naman, salamat.", translation: "I'm fine, thank you.", options: ["Mabuti naman, salamat.", "Hindi mabuti, salamat.", "Mabuti na, pakiusap."] },
  { say: "Paalam na.", translation: "Goodbye.", options: ["Paalam na.", "Ingat ka.", "Magkita tayo."] },
  { say: "Maligayang bati!", translation: "Congratulations!", options: ["Maligayang bati!", "Maligayang pagdating!", "Maligayang kaarawan!"] },
  { say: "Ingat ka sa daan.", translation: "Take care on the road.", options: ["Ingat ka sa daan.", "Ingat ka sa bahay.", "Ingat ka sa akin."] },
  { say: "Kamusta ang pamilya mo?", translation: "How is your family?", options: ["Kamusta ang pamilya mo?", "Kamusta ang trabaho mo?", "Kamusta ang bahay mo?"] },
  { say: "Magkita tayo bukas.", translation: "Let's meet tomorrow.", options: ["Magkita tayo bukas.", "Magkita tayo ngayon.", "Magkita tayo mamaya."] },
  // POLITENESS
  { say: "Maraming salamat.", translation: "Thank you very much.", options: ["Maraming salamat.", "Kaunting salamat.", "Walang salamat."] },
  { say: "Walang anuman.", translation: "You're welcome.", options: ["Walang anuman.", "Walang problema.", "Walang bale."] },
  { say: "Paumanhin po.", translation: "Excuse me / I'm sorry.", options: ["Paumanhin po.", "Pakiusap po.", "Salamat po."] },
  { say: "Hindi ko maintindihan.", translation: "I don't understand.", options: ["Hindi ko maintindihan.", "Hindi ko marinig.", "Hindi ko malaman."] },
  { say: "Ulitin mo nga, pakiusap.", translation: "Please repeat that.", options: ["Ulitin mo nga, pakiusap.", "Pakiusap, magsalita nang malakas.", "Pakiusap, magsalita nang dahan-dahan."] },
  // FOOD
  { say: "Gusto ko ng kanin.", translation: "I want rice.", options: ["Gusto ko ng kanin.", "Gusto ko ng tinapay.", "Gusto ko ng itlog."] },
  { say: "Isang baso ng tubig, pakiusap.", translation: "A glass of water, please.", options: ["Isang baso ng tubig, pakiusap.", "Isang tasa ng kape, pakiusap.", "Isang baso ng gatas, pakiusap."] },
  { say: "Masarap ang pagkain!", translation: "The food is delicious!", options: ["Masarap ang pagkain!", "Malasa ang pagkain!", "Masama ang pagkain!"] },
  { say: "Gutom na ako.", translation: "I'm already hungry.", options: ["Gutom na ako.", "Busog na ako.", "Uhaw na ako."] },
  { say: "Magkano ang almusal?", translation: "How much is the breakfast?", options: ["Magkano ang almusal?", "Magkano ang tanghalian?", "Magkano ang hapunan?"] },
  { say: "Pakihingi ng bill.", translation: "Please get the bill.", options: ["Pakihingi ng bill.", "Pakihingi ng menu.", "Pakihingi ng tubig."] },
  { say: "Ano ang espesyal ngayon?", translation: "What is the special today?", options: ["Ano ang espesyal ngayon?", "Ano ang masarap ngayon?", "Ano ang bago ngayon?"] },
  // SHOPPING
  { say: "Magkano ito?", translation: "How much is this?", options: ["Magkano ito?", "Magkano iyan?", "Magkano iyon?"] },
  { say: "Mahal ito.", translation: "This is expensive.", options: ["Mahal ito.", "Mura ito.", "Libre ito."] },
  { say: "Wala na bang tawad?", translation: "No discount?", options: ["Wala na bang tawad?", "Wala na bang sale?", "Wala na bang bago?"] },
  { say: "Bibilhin ko ito.", translation: "I will buy this.", options: ["Bibilhin ko ito.", "Titingnan ko ito.", "Ibabalik ko ito."] },
  { say: "May ibang kulay ba?", translation: "Is there another color?", options: ["May ibang kulay ba?", "May ibang sukat ba?", "May ibang klase ba?"] },
  // FAMILY
  { say: "Ito ang aking nanay.", translation: "This is my mother.", options: ["Ito ang aking nanay.", "Ito ang aking tatay.", "Ito ang aking kapatid."] },
  { say: "Dalawang anak ang mayroon kami.", translation: "We have two children.", options: ["Dalawang anak ang mayroon kami.", "Isang anak ang mayroon kami.", "Tatlong anak ang mayroon kami."] },
  { say: "Nakatira si Lola sa probinsya.", translation: "Grandmother lives in the province.", options: ["Nakatira si Lola sa probinsya.", "Nakatira si Lola sa Maynila.", "Nakatira si Lola sa abroad."] },
  { say: "Mahal ko ang aking pamilya.", translation: "I love my family.", options: ["Mahal ko ang aking pamilya.", "Miss ko ang aking pamilya.", "Kilala ko ang aking pamilya."] },
  // NUMBERS & TIME
  { say: "Anong oras na?", translation: "What time is it?", options: ["Anong oras na?", "Anong petsa ngayon?", "Anong araw ngayon?"] },
  { say: "Alas dose ng tanghali.", translation: "It is twelve noon.", options: ["Alas dose ng tanghali.", "Alas siyete ng umaga.", "Alas nuwebe ng gabi."] },
  { say: "Maaga pa ang oras.", translation: "It's still early.", options: ["Maaga pa ang oras.", "Huli na ang oras.", "Tamang-tama ang oras."] },
  { say: "Bukas na ang Linggo.", translation: "Sunday is already tomorrow.", options: ["Bukas na ang Linggo.", "Bukas na ang Lunes.", "Bukas na ang Sabado."] },
  { say: "Isa, dalawa, tatlo, apat, lima.", translation: "One, two, three, four, five.", options: ["Isa, dalawa, tatlo, apat, lima.", "Anim, pito, walo, siyam, sampu.", "Sampu, siyam, walo, pito, anim."] },
  // DIRECTIONS
  { say: "Kumanan ka sa kanto.", translation: "Turn right at the corner.", options: ["Kumanan ka sa kanto.", "Kumaliwa ka sa kanto.", "Diretso ka sa kanto."] },
  { say: "Malapit lang ang palengke.", translation: "The market is just nearby.", options: ["Malapit lang ang palengke.", "Malayo ang palengke.", "Nasa kanto ang palengke."] },
  { say: "Saan ang pinakamalapit na CR?", translation: "Where is the nearest restroom?", options: ["Saan ang pinakamalapit na CR?", "Saan ang pinakamalapit na tindahan?", "Saan ang pinakamalapit na ospital?"] },
  { say: "Dito ka lang kumanan.", translation: "Just turn right here.", options: ["Dito ka lang kumanan.", "Dito ka lang kumaliwa.", "Dito ka lang tumigil."] },
  // DAILY LIFE
  { say: "Kumain ka na ba?", translation: "Have you eaten yet?", options: ["Kumain ka na ba?", "Naligo ka na ba?", "Natulog ka na ba?"] },
  { say: "Nagtatrabaho ako ngayon.", translation: "I am working now.", options: ["Nagtatrabaho ako ngayon.", "Nag-aaral ako ngayon.", "Naglalaro ako ngayon."] },
  { say: "Aalis na ako, ha.", translation: "I'm leaving now, okay.", options: ["Aalis na ako, ha.", "Babalik na ako, ha.", "Uuwi na ako, ha."] },
  { say: "Saan ka pupunta?", translation: "Where are you going?", options: ["Saan ka pupunta?", "Kailan ka aalis?", "Bakit ka aalis?"] },
  { say: "Nag-aaral ako ng Tagalog.", translation: "I'm studying Tagalog.", options: ["Nag-aaral ako ng Tagalog.", "Nagtuturo ako ng Tagalog.", "Nagbabasa ako ng Tagalog."] },
  // HEALTH
  { say: "Masakit ang ulo ko.", translation: "My head hurts.", options: ["Masakit ang ulo ko.", "Masakit ang tiyan ko.", "Masakit ang paa ko."] },
  { say: "Kailangan ko ng doktor.", translation: "I need a doctor.", options: ["Kailangan ko ng doktor.", "Kailangan ko ng gamot.", "Kailangan ko ng ospital."] },
  { say: "Hindi ako masama.", translation: "I'm not feeling well.", options: ["Hindi ako masama.", "Mabuti naman ako.", "Okey lang ako."] },
  // TRANSPORT
  { say: "Magkano ang pamasahe?", translation: "How much is the fare?", options: ["Magkano ang pamasahe?", "Magkano ang taksi?", "Magkano ang bus?"] },
  { say: "Para po!", translation: "Stop please! (to driver)", options: ["Para po!", "Hintay po!", "Lakad po!"] },
  { say: "Saan ang hintayan ng jeep?", translation: "Where is the jeepney stop?", options: ["Saan ang hintayan ng jeep?", "Saan ang hintayan ng bus?", "Saan ang hintayan ng taxi?"] },
  // FEELINGS
  { say: "Masaya ako ngayon.", translation: "I am happy today.", options: ["Masaya ako ngayon.", "Malungkot ako ngayon.", "Galit ako ngayon."] },
  { say: "Mahal kita.", translation: "I love you.", options: ["Mahal kita.", "Miss kita.", "Kilala kita."] },
  { say: "Mabuhay ang Pilipinas!", translation: "Long live the Philippines!", options: ["Mabuhay ang Pilipinas!", "Mabuhay ang Maynila!", "Mabuhay ang Filipino!"] },
];
