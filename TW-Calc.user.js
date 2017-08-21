// ==UserScript==
// @name The-West Calc
// @version 1.15
// @description The-West Battle Calc, Notepad, Battle stats, Duel Calc, Duel list, Craft list, Job list, Wardrobe, Tombola analyser
// @author theTim, Tom Robert
// @website http://tw-calc.net
// @include	https://*.the-west.*/game.php*
// @include	https://*.the-west.com.*/game.php*
// @include	https://*.tw.innogames.*/game.php*
// @exclude https://classic.the-west.net*
// @downloadURL https://tw-calc.net/script/TW-Calc.user.js
// @grant none
// ==/UserScript==

TWCalc_inject = function ()
{

    if (document.getElementById('TWCalc_js')) return;

    var TWCalcjs = document.createElement('script');
    TWCalcjs.setAttribute('type', 'text/javascript');
    TWCalcjs.setAttribute('language', 'javascript');
    TWCalcjs.setAttribute('id', 'TWCalc_js');
    TWCalcjs.innerHTML = "var _TWCalc_int = setInterval(" + (function ()
        {
            clearInterval(_TWCalc_int);

            TW_Calc = {
                scriptName: "The-West Calc",
                version: "1.15",
                gameMAX: Game.version.toString(),
                author: "MarcusJohnyEvans&Tom Robert",
                gameMIN: "1.36",
                website: "https://tw-calc.net",
                updateURL: "https://tw-calc.net/script/TW-Calc.user.js",
                updateURL_SPONSORED: "http://adf.ly/1INaPB",
                shortName: "tw-calc",
                birthday_enabled: true,
                birhday:
                    {
                        month: 11,
                        day: 16
                    },
                Wardrobe_bannedLocales: ["hu_HU"],
                ShowUntranslated: false,
                UseLocalLanguaguePack: false,
                ShowLogs: false,
                bottomImg: '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',
            };

            TW_Calc.bool = function (a)
            {

                var k = [undefined, null, NaN, "", 0];

                return (k.indexOf(a) === -1);

            };

            TW_Calc.imgUrl = "//westzzs.innogamescdn.com/";

            TW_Calc.langs = {
                "en_US":
                    {
                        translator: "Laki235",
                        lang_0: "No",
                        lang_1: "Yes",
                        lang_2: "with premium",
                        lang_3: "Settings",
                        lang_4: "Skills",
                        lang_5: "Leadership",
                        lang_6: "Hiding",
                        lang_7: "Stamina",
                        lang_8: "Dodging",
                        lang_9: "Aiming",
                        lang_14: "Attack",
                        lang_15: "Defence",
                        lang_18: "Position on map",
                        lang_20: "The tower of your character",
                        lang_21: "Grass",
                        lang_22: "Tower - level",
                        lang_27: "Calculate",
                        lang_28: "Health",
                        lang_29: "Health points",
                        lang_30: "Level",
                        lang_31: "Fortbattle attack",
                        lang_32: "Character",
                        lang_33: "Fortbattle defence",
                        lang_34: "Other",
                        lang_35: "Delete",
                        lang_36: "Save",
                        lang_37: "Set time",
                        lang_38: "Greenhorn",
                        lang_39: "Dueller",
                        lang_40: "Adventurer",
                        lang_41: "Soldier",
                        lang_42: "Worker",
                        lang_43: "Player name",
                        lang_44: "Game world",
                        lang_45: "Player level",
                        lang_46: "Character class",
                        lang_49: "Health",
                        lang_50: "Attack",
                        lang_51: "Defense",
                        lang_52: "Gameworld",
                        lang_61: "Health",
                        lang_62: "Alarmclock settings",
                        lang_63: "Calculate the highest and lowest duelling level you are able to duel",
                        lang_64: "Calculate the amount of experiences gained from a duel",
                        lang_66: "Your duelling level",
                        lang_67: "Calculate",
                        lang_68: "Highest possible duelling level",
                        lang_69: "Lowest possible duelling level",
                        lang_70: "Duelling level of your opponent",
                        lang_71: "Duel motivation",
                        lang_72: "How to write a date? Example:",
                        lang_77: "for The-West Calc is a new version available, please click ok to update the Userscript",
                        lang_78: "TW-Calc Update needed",
                        lang_79: "Current version",
                        lang_80: "Later",
                        lang_81: "Your note",
                        lang_82: "Time",
                        lang_83: "TW-Calc Alarm clock",
                        lang_86: "Victory: You gain",
                        lang_87: "experience and",
                        lang_88: "Successfully saved",
                        lang_89: "Your notes has been successfully deleted",
                        lang_90: "Alarm Clock not set (BAD SYNTAX)",
                        lang_91: "Alarm clock set",
                        lang_92: "Cancel",
                        lang_93: "TW-Calc Alarm clock - settings",
                        lang_94: "Alarm clock",
                        lang_95: "Enter URL adress of your sound. For example: https://tw-calc.net/script/budik.mp3",
                        lang_96: "Alarm clock set",
                        lang_97: "Melody of alarm clock: Alarm1, Alarm2",
                        lang_98: "Health points",
                        lang_100: "Full energy for",
                        lang_101: "hours and",
                        lang_102: "minutes",
                        lang_103: "Experience points",
                        lang_104: "Full health for:",
                        lang_105: "Transfer fee",
                        lang_106: "Transfer fee",
                        lang_107: "Transfer amount",
                        lang_108: "Add bank fees calculator (during transfer) to the bank window",
                        lang_109: "Add energy&health refill calculators",
                        lang_110: "duel experience.",
                        lang_111: "New version",
                        lang_112: "Whats new",
                        lang_113: "Edit",
                        lang_114: "Duelling level",
                        lang_115: "Duleable",
                        lang_116: "Distance",
                        lang_117: "Center map",
                        lang_118: "Town",
                        lang_122: "Note",
                        lang_123: "Really?",
                        lang_124: "Actually empty",
                        lang_140: "Ressistance",
                        lang_141: "Damage",
                        lang_143: "Loading",
                        lang_146: "All your saved jobs will be removed. Are you sure you want to do it?",
                        lang_147: "Close (Saved automatically)",
                        lang_148: "RESET JOBS",
                        lang_149: "RESET",
                        lang_150: "Add/remove Jobs",
                        lang_151: "Search for job",
                        lang_152: "Job list",
                        lang_153: "Replace native craft window in the menu by Westcalc crat window",
                        lang_154: "Open duel window",
                        lang_157: "Name",
                        lang_159: "Importing...",
                        lang_160: "Own skills",
                        lang_161: "New equipment",
                        lang_162: "Close",
                        lang_163: "Add",
                        lang_164: "Current clothing will be added as new equipment.",
                        lang_165: "Successfull",
                        lang_166: "Name..",
                        lang_167: "Job",
                        lang_169: "Show configuration of this set",
                        lang_170: "Wardrobe",
                        lang_171: "Remove this set",
                        lang_172: "Create",
                        lang_173: "Tombola analyser",
                        lang_174: "Travelling fair",
                        lang_175: "Add wardrobe to the game",
                        lang_176: "Hide unavailable materials",
                        lang_177: "Craft",
                        lang_178: "Toggle all recipes",
                        lang_179: "Field cook",
                        lang_180: "Tonic peddler",
                        lang_181: "Blacksmith",
                        lang_182: "Master Saddler",
                        lang_183: "Crafting",
                        lang_184: "Add Westcalc icon to the right menu",
                        lang_185: "Position of Job bar",
                        lang_186: "Top",
                        lang_187: "Bottom",
                        lang_188: "In right panel",
                        lang_189: "Hide",
                        lang_190: "without premium",
                        lang_191: "Position of duel panel",
                        lang_192: "Show the crafting product",
                        lang_193: "Setting Traps",
                        lang_194: "Valentine\'s Day",
                        lang_195: "Easter",
                        lang_196: "Independence Day",
                        lang_197: "Octoberfest",
                        lang_198: "Day of the Dead",
                        lang_199: "Defeat: You lose",
                        lang_200: "Energy",
                        lang_201: "Weapon damage",
                        lang_202: "Cloth bonus",
                        lang_203: "Wall - level",
                        lang_204: "Accept the quest to see the quest giver",
                        lang_205: "Show quest giver on map",
                        lang_206: "Show the quest on TW-Calc.net",
                    },
                "sk_SK":
                    {
                        translator: "theTim",
                        lang_0: "Nie",
                        lang_1: "Áno",
                        lang_2: "s prémiom",
                        lang_3: "Nastavenia",
                        lang_4: "Schopnosti",
                        lang_5: "Vodcovstvo",
                        lang_6: "Skrývanie",
                        lang_7: "Vytrvalosť",
                        lang_8: "Uhýbanie",
                        lang_9: "Presnosť",
                        lang_14: "Šanca na zásah",
                        lang_15: "Šanca na úhyb",
                        lang_18: "Pozícia na mape pevnosti",
                        lang_20: "Veža tvojho charakteru",
                        lang_21: "Nebonusový sektor",
                        lang_22: "Veža - úroveň 1",
                        lang_27: "Vypočítaj",
                        lang_28: "Zdravie",
                        lang_29: "Body zdravia",
                        lang_30: "Úroveň",
                        lang_31: "Útok",
                        lang_32: "Postava",
                        lang_33: "Obrana",
                        lang_34: "Iné",
                        lang_35: "Zmaž",
                        lang_36: "Ulož",
                        lang_37: "Nastav budík",
                        lang_38: "Zelenáč",
                        lang_39: "Duelant",
                        lang_40: "Dobrodruh",
                        lang_41: "Vojak",
                        lang_42: "Pracovník",
                        lang_43: "Meno hráča",
                        lang_44: "Herný svet",
                        lang_45: "Úroveň hráča",
                        lang_46: "Trieda postavy",
                        lang_49: "Zdravie",
                        lang_50: "Šanca na zásah",
                        lang_51: "Šanca na úhyb",
                        lang_52: "Herný svet",
                        lang_61: "Zdravie",
                        lang_62: "Nastavenie budíka",
                        lang_63: "Kalkulátor na výpočet maximálnej a minimálnej duelovatelnej duelovej úrovne",
                        lang_64: "Kalkulátor na výpočet skúseností z duelu",
                        lang_66: "Tvoja duelová úroveň",
                        lang_67: "Vypočítaj",
                        lang_68: "Maximálna duelová duelovateľná úroveň",
                        lang_69: "Minimálna duelová duelovateľná úroveň",
                        lang_70: "Duelová úroveň protivníka",
                        lang_71: "Duelová motivácia",
                        lang_72: "Ako správne zapísať čas? Príklad:",
                        lang_77: "Pre TW-Calc je dostupná aktualizácia, klikni prosím na ok pre aktualizáciu scriptu",
                        lang_78: "TW-Calc potrebuje aktualizáciu",
                        lang_79: "Aktuálna verzia",
                        lang_80: "Neskôr",
                        lang_81: "Tvoja poznámka",
                        lang_82: "Čas",
                        lang_83: "TW-Calc Budík",
                        lang_86: "Ak vyhráš duel, získaš",
                        lang_87: "skúseností a",
                        lang_88: "Úspešne uložené",
                        lang_89: "Tvoje poznámky boli úspešne zmazané",
                        lang_90: "Budík nenastavený (ZLÁ SYNTAX)",
                        lang_91: "Budík nastavený",
                        lang_92: "Zruš",
                        lang_93: "TW-Calc Budík - nastavenia",
                        lang_94: "Zvuk budíka",
                        lang_95: "Zadajte url adresu zvuku. Príklad: https://tw-calc.net/script/budik.mp3",
                        lang_96: "Budík nastavený",
                        lang_97: "Budíky: Alarm1, Alarm2",
                        lang_98: "Body zdravia",
                        lang_100: "Plná energia za",
                        lang_101: "hodín a",
                        lang_102: "minút",
                        lang_103: "Body skúsenosti",
                        lang_104: "Plné zdravie za:",
                        lang_105: "Poplatok za prevod",
                        lang_106: "Poplatky",
                        lang_107: "Prevedená suma",
                        lang_108: "Pridať do banky automatický kalkulátor bankových poplatkov (pri prevode)",
                        lang_109: "Pridať do hry kalkulátory času doplnenia energie a zdravia",
                        lang_110: "duelových skúseností.",
                        lang_111: "Nová verzia",
                        lang_112: "Čo je nové",
                        lang_113: "Upraviť zoznam hráčov",
                        lang_114: "Duelová úroveň",
                        lang_115: "Duel možný",
                        lang_116: "Vzdialenosť",
                        lang_117: "Vycentruj mapu",
                        lang_118: "Mesto",
                        lang_121: "Nič",
                        lang_122: "Poznámka",
                        lang_123: "Naozaj chceš vymazať poznámky?",
                        lang_124: "Momentálne prázdne",
                        lang_140: "Odpor",
                        lang_141: "Poškodenie zbrane",
                        lang_143: "Načítava sa",
                        lang_146: "Všetky tvoje uložené práce budú zmazané, naozaj to chceš tak urobiť?",
                        lang_147: "Zatvoriť (Údaje budú uložené automaticky)",
                        lang_148: "Vynulovať práce",
                        lang_149: "Vynulovať",
                        lang_150: "Pridaj/vymaž práce",
                        lang_151: "Hľadaj prácu",
                        lang_152: "Zoznam prác",
                        lang_153: "Nahraď herné okno s remeslom remeselným oknom Westcalcu v menu",
                        lang_154: "Otvor duelové okno",
                        lang_157: "Názov",
                        lang_159: "Importujem...",
                        lang_160: "Vlastné atribúty",
                        lang_161: "Pridať nový set",
                        lang_162: "Zatvoriť",
                        lang_163: "Pridať",
                        lang_164: "Oblečenie ktoré máš oblečené na sebe bude pridané ako vlastný set, pre potvrdenie klikni na ",
                        lang_165: "Úspešné",
                        lang_166: "Názov..",
                        lang_167: "Práca",
                        lang_169: "Zobraz konfiguráciu tohoto setu",
                        lang_170: "Šatník",
                        lang_171: "Vymaž tento set",
                        lang_172: "Vytvoriť",
                        lang_173: "Tombola analyzér",
                        lang_174: "Kočovný cirkus",
                        lang_175: "Pridať do hry šatník",
                        lang_176: "Zobraz recepry, ktoré môžem vyrobiť",
                        lang_177: "Vyrobiť",
                        lang_178: "Otvor všetky recepty",
                        lang_179: "Poľný kuchár",
                        lang_180: "Mastičkár",
                        lang_181: "Kováč",
                        lang_182: "Majste sedla",
                        lang_183: "Remeslo",
                        lang_184: "Pridať ikonu Westcalc-u do pravého menu",
                        lang_185: "Pozícia panelu s odkazmi na práce",
                        lang_186: "Hore",
                        lang_187: "Dole",
                        lang_188: "V pravom panely",
                        lang_189: "Skryť",
                        lang_190: "bez prémia",
                        lang_191: "Pozícia duelového panelu",
                        lang_192: "Zobraziť remeselný produkt",
                        lang_193: "Nástraha pascí",
                        lang_194: "Valentín",
                        lang_195: "Veľká noc",
                        lang_196: "Deň nezávislosti",
                        lang_197: "Októberfest",
                        lang_198: "Deň mŕtvych",
                        lang_199: "Defeat: You lose",
                        lang_200: "Energia",
                        lang_201: "Poškodenie zbrane",
                        lang_202: "Bonus z oblečenia",
                        lang_203: "Hradba - úroveň",
                        lang_204: "Prijmi úlohu aby si zobrazil zadávateľa úloh",
                        lang_205: "Zobraz zadávateľa úloh na mape",
                        lang_206: "Zobaziť úlohu na TW-Calc.net",
                    },
            };

            TW_Calc.itemIds = {
                "golden_rifle": 136000,
                "roalstad_scarf": 576000,
                "octoberfest_fort_weapon_2": 188000,
                "octoberfest_weapon_ranged_2": 900000,
                "octoberfest_weapon_melee_2": 92000,
                "sam_hawkens_knive": 59000,
                "octoberfest_weapon_melee_winner": 94000,
                "octoberfest_fort_weapon_winner": 190000,
                "octoberfest_weapon_ranged_winner": 902000,
                "independence_fort_weapon_winner": 186000,
                "independence_weapon_melee_winner": 90000,
                "independence_weapon_ranged_winner": 898000,
                "4july_2014_yield_1": 2610000,
                "4july_2014_horse_2": 692000,
                "4july_2014_yield_2": 2611000,
                "4july_2014_melee_ranking_winner": 45032000,
                "4july_2014_rifle_ranking_winner": 44052000,
                "independence_neck_2": 41029000,
                "independence_hat_2": 42017000,
                "independence_body_2": 40058000,
                "independence_belt_2": 11191000,
                "independence_pants_2": 10202000,
                "independence_foot_2": 491000,
                "octoberfest_foot_2": 496000,
                "octoberfest_pants_2": 10207000,
                "octoberfest_belt_2": 11196000,
                "octoberfest_body_2": 40064000,
                "octoberfest_neck_2": 41034000,
                "octoberfest_hat_2": 42022000,
                "4july_2014_pants_1": 10325000,
                "4july_2014_belt_1": 11300000,
                "4july_2014_body_1": 40230000,
                "4july_2014_neck_1": 41225000,
                "4july_2014_head_1": 42225000,
                "4july_2014_shoes_1": 43225000,
                "4july_2014_pants_2": 10326000,
                "4july_2014_belt_2": 11301000,
                "4july_2014_body_2": 40231000,
                "4july_2014_neck_2": 41226000,
                "4july_2014_head_2": 42226000,
                "4july_2014_shoes_2": 43226000,
                "independence_hat_1": 42016000,
                "independence_body_1": 40057000,
                "independence_belt_1": 11190000,
                "independence_pants_1": 10201000,
                "independence_foot_1": 490000,
                "fort_sabre": 68000,
                "fortset_rifle": 152000,
                "fortset_gun": 879000,
                "independence_weapon_ranged_1": 895000,
                "independence_fort_weapon_1": 183000,
                "independence_weapon_melee_1": 87000,
                "independence_neck_1": 41028000,
                "4july_2014_horse_1": 691000,
                "4july_2014_revolver_ranking_winner": 941000,
            };

            TW_Calc.storage = {};

            TW_Calc.storage.add = function (id, value)
            {
                localStorage.setItem("TWCalc_" + id, value);
            };

            TW_Calc.storage.remove = function (id)
            {
                localStorage.removeItem("TWCalc_" + id);
            };

            TW_Calc.storage.get = function (id)
            {
                return localStorage.getItem("TWCalc_" + id);
            };

            TW_Calc.AvailableLangs = ["sk_SK", "cs_CZ", "es_ES", "pt_BR", "pl_PL", "sv_SE", "hu_HU", "ro_RO", "tr_TR", "nn_NO", "it_IT", "de_DE", "nl_NL", "ru_RU", "el_GR"];

            TW_Calc.loadPack = function (a)
            {

                TW_Calc.storage.add("LANG_PACK", JSON.stringify(a));

                var today = new Date();
                var o = { d: today.getDate(), y: today.getFullYear(), m: today.getMonth() + 1 };
                var b = o.m + "/" + o.d + "/" + o.y;

                TW_Calc.storage.add("LANG_PACK_LAST_UPDATE", b);
                TW_Calc.lang = a;
                TW_Calc.loadedPack = true;
                TW_Calc.inject();

            };

            TW_Calc.loadedPack = false;

            TW_Calc.loadLangPack = function ()
            {

                $.ajax(
                    {
                        url: TW_Calc.website + "/service/get-script-language-pack?lang=" + TW_Calc.getAvailableLang() + "&" + (new Date().toDateString()) + "&" + TW_Calc.version,
                        dataType: "jsonp",
                        timeout: 4000,
                        success: function ()
                        {

                            if (TW_Calc.storage.get("LANG_PACK_LAST_UPDATE") !== null)
                            {

                                TW_Calc.lang = $.parseJSON(TW_Calc.storage.get("LANG_PACK"));

                            }
                            else
                            {

                                var lang = TW_Calc.getLang();
                                TW_Calc.lang = TW_Calc.langs[lang];

                            }

                            TW_Calc.loadedPack = true;
                            TW_Calc.inject();

                        }
                    });

                setTimeout(function ()
                {

                    if (TW_Calc.loadedPack === false)
                    {

                        if (TW_Calc.storage.get("LANG_PACK_LAST_UPDATE") !== null)
                        {

                            TW_Calc.lang = $.parseJSON(TW_Calc.storage.get("LANG_PACK"));

                        }
                        else
                        {

                            var lang = TW_Calc.getLang();
                            TW_Calc.lang = TW_Calc.langs[lang];

                        }

                        TW_Calc.loadedPack = true;
                        TW_Calc.inject();

                    }

                }, 4000);
            };

            TW_Calc.getLang = function ()
            {
                return TW_Calc.langs.hasOwnProperty(TW_Calc.getLocale()) ? Game.locale : "en_US";
            };

            TW_Calc.getLocale = function ()
            {
                return Game.locale;
            };

            TW_Calc.getAvailableLang = function ()
            {
                return TW_Calc.AvailableLangs.indexOf(TW_Calc.getLocale()) != -1 ? Game.locale : "en_US";
            };

            TW_Calc.checkLang = function ()
            {

                var lang = TW_Calc.getLang();

                TW_Calc.lang = TW_Calc.langs[lang];

                if (TW_Calc.UseLocalLanguaguePack === true)
                {

                    TW_Calc.inject();

                }
                else
                {

                    if (TW_Calc.storage.get("LANG_PACK_LAST_UPDATE") !== null)
                    {

                        TW_Calc.lang = $.parseJSON(TW_Calc.storage.get("LANG_PACK"));

                        var a = new Date(TW_Calc.storage.get("LANG_PACK_LAST_UPDATE"));
                        var today = new Date();
                        var b = new Date(a);

                        var timeDiff = Math.abs(today.getTime() - b.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        if (diffDays > 5)
                        {

                            TW_Calc.loadLangPack();

                        }
                        else
                        {

                            TW_Calc.lang = $.parseJSON(TW_Calc.storage.get("LANG_PACK"));
                            TW_Calc.inject();

                        }

                    }
                    else
                    {
                        TW_Calc.loadLangPack();
                    }

                }
            };

            TW_Calc.usedLangIds = [];

            TW_Calc.getTranslation = function (id)
            {

                if (TW_Calc.usedLangIds.indexOf(id) == -1) TW_Calc.usedLangIds.push(id);

                if (typeof (TW_Calc.lang["lang_" + id]) != "undefined")
                {

                    if (TW_Calc.lang["lang_" + id] != '')
                        return TW_Calc.lang["lang_" + id];
                    else
                        return TW_Calc.langs.en_US["lang_" + id];

                }
                else
                {

                    if (TW_Calc.ShowUntranslated === true)
                        return 'untranslated';
                    else
                        return TW_Calc.langs.en_US["lang_" + id];

                }


            };

            TW_Calc.showTab = function (id)
            {

                if ($(".TWcalc_window_ > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > ._tab_id_" + id).hasClass("tw2gui_window_tab_active") !== true)
                {

                    $(".TWcalc_window_ > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > *").each(function ()
                    {
                        $(this).removeClass("tw2gui_window_tab_active");
                    });

                    $(".TWcalc_window_ > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > ._tab_id_" + id).addClass("tw2gui_window_tab_active");

                    $(".TWcalc_window_ > div.tw2gui_window_content_pane > *").each(function ()
                    {
                        $(this).hide();
                    });

                    $(".TWcalc_window_ > div.tw2gui_window_content_pane > #tab_" + id).fadeIn();
                }

            };

            TW_Calc.launch = function ()
            {

                var tabclick = function (win, id)
                {
                    if (id == 'twcalc3')
                        try
                        {
                            TW_Calc.TWCalcMyinfo.launch();
                        }
                        catch (e)
                        {
                            new TW_Calc.Error(e, 'launch(TWCalcMyinfo.launch)').show();
                        }
                    TW_Calc.showTab(id);
                };

                var id = "TWcalc_window_";

                TW_Calc.functions.cookie.load();

                if ((localStorage.getItem("TWCalc_alarmClock") === null) || (localStorage.getItem("TWCalc_alarmClock") === ''))
                {
                    date = TW_Calc.info.actualtime();
                }
                else
                {
                    date = localStorage.getItem("TWCalc_alarmClock");
                }

                var Tab1_HTML = '<div style="position:absolute;width:685x; height:250px; top:50px;"><span class="tw2gui_textarea" style="display:inline-block; "><div class="tw2gui_bg"></div><div class="tw2gui_bg_tl"></div><div class="tw2gui_bg_br"></div><div class="tw2gui_bg_tr"></div><div class="tw2gui_bg_bl"></div><div class="tw2gui_textarea_wrapper"><textarea id="TW_Calc_Block" style="width:675px; height: 295px; "></textarea></div></span></div>' + '<div style="position:absolute;top:15px;left:100px;" class="tw2gui_button" onclick="TW_Calc.functions.save_notepad_text();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold;">' + TW_Calc.getTranslation(36) + '</div></div><div style="position:absolute;top:15px;left:0px;" class="tw2gui_button" onclick="TW_Calc.functions.confirm_deleting();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold;">' + TW_Calc.getTranslation(35) + '</div></div>' + '<div style="position:absolute;width:50x;height:30px;top:15px;right:10px;"><img src="' + TW_Calc.imgUrl + '/images/icons/clock.png" width="20" height="20"><span class="tw2gui_textfield"><span><input type="text" size="12" value="' + date + '" id="Wt3"></span></span></span><img style="cursor:help;" src="' + TW_Calc.imgUrl + '/images/window/character/info.png" title="' + TW_Calc.getTranslation(72) + ' ' + TW_Calc.info.actualtime() + '"><div class="tw2gui_button" onclick="TW_Calc.functions.AlarmClock();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold">' + TW_Calc.getTranslation(37) + '</div></div><div class="tw2gui_button" onclick="TW_Calc.functions.edit_note();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold;">' + TW_Calc.getTranslation(122) + '</div></div></div>';

                var Tab2_HTML = '<div id="battle_calc" style="position:absolute;width:690px;height:355px;top:10px;"></div>';

                var Tab3_HTML = '<div id="block1" style="position:absolute;top:10px;left:0px;"></div><div id="block2" style="position:absolute;top:115px;right:5px;"></div><div id="block3" style="position:absolute;width:270px;top:115px;left:0px;"></div><div id="block4" style="position:absolute;top:320px;left:0px;"></div>';

                var Tab2_1 = '<div style="position: absolute;left: 80px;top: 0px;">' +
                    '<div style="position:absolute;width:88px;height:60px;top:20px;left:0px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_aim.png" title="' + CharacterSkills.skills.aim.name + '"><div class="tw2gui_plusminus"><span unselectable="on" id="twcalc_aim_value"class="displayValueBonus text_green unselectable" style="display:inline-block;width:56px;"></span></div></div>' +
                    '<div style="position:absolute;width:88px;height:60px;top:20px;left:86px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_dodge.png" title="' + CharacterSkills.skills.dodge.name + '"><div class="tw2gui_plusminus"><span unselectable="on" id="twcalc_dodge_value"class="displayValueBonus text_green unselectable" style="display:inline-block;width:56px;"></span></div></div>' +
                    '<div style="position:absolute;width:88px;height:60px;top:20px;left:172px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_pitfall.png" title="' + CharacterSkills.skills.pitfall.name + '"><div class="tw2gui_plusminus"><span unselectable="on" id="twcalc_pitfall_value"class="displayValueBonus text_green unselectable" style="display:inline-block;width:56px;"></span></div></div>' +
                    '<div style="position:absolute;width:88px;height:60px;top:20px;left:258px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_hide.png" title="' + CharacterSkills.skills.hide.name + '"><div class="tw2gui_plusminus"><span unselectable="on" id="twcalc_hide_value" class="displayValueBonus text_green unselectable" style="display:inline-block;width:56px;"></span></div></div>' +
                    '<div style="position:absolute;width:88px;height:60px;top:20px;left:344px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_leadership.png" title="' + CharacterSkills.skills.leadership.name + ' "><div class="tw2gui_plusminus"><span unselectable="on" id="twcalc_leadership_value"class="displayValueBonus text_green unselectable" style="display:inline-block;width:56px;"></span></div></div>' +
                    '<div style="position:absolute;width:88px;height:60px;top:20px;left:430px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_health.png" title="' + CharacterSkills.skills.health.name + '"><div class="tw2gui_plusminus"><span unselectable="on" id="twcalc_health_value"class="displayValueBonus text_green unselectable" style="display:inline-block;width:56px;"></span></div></div>';

                var Tab2_2 = '<div><span style="font-weight:bold;font-size:15px;color:red;width:100%;">' + TW_Calc.getTranslation(31) + '</span></br><span style="display:inline-block;font-weight:bold;width:50%;">' + TW_Calc.getTranslation(14) + '</span><span id="tw_t6">0</span></br><span style="display:inline-block;font-weight:bold;width:50%;">' + TW_Calc.getTranslation(51) + '</span><span id="tw_t7">0</span></br><span style="display:inline-block;font-weight:bold;width:50%;">' + TW_Calc.getTranslation(140) + '</span><span id="tw_odpor1">0</span></br><span style="font-weight:bold;font-size:15px;color:blue;width:50%;">' + TW_Calc.getTranslation(33) + '</span></br><span style="display:inline-block;font-weight:bold;width:50%;">' + TW_Calc.getTranslation(14) + '</span><span id="tw_t8">0</span></br><span style="display:inline-block;font-weight:bold;width:50%;">' + TW_Calc.getTranslation(51) + '</span><span id="TW_t9">0</span></br><span style="display:inline-block;font-weight:bold;width:50%;">' + TW_Calc.getTranslation(140) + '</span><span id="tw_odpor2">0</span></br><span style="display:inline-block;font-weight:bold;font-size:15px;width:50%;">' + TW_Calc.getTranslation(28) + ': </span><span id="TW_t10">0</span></br><span style="display:inline-block;font-weight:bold;font-size:15px;width:50%;">' + TW_Calc.getTranslation(141) + ': </span><span id="TW_dmg_weapon">0</span></div></div>';

                var Tab2_3 = '<div style="font-size: 12px;"><span style="font-weight:bold;font-size:large;width:190px;">' + TW_Calc.getTranslation(43) + '</span></br><span id="TWCalc_name"></span></br><span id="TWCalc_Lang_characlass" style="display:inline-block;font-weight:bold;font-size:large;width:190px;">' + TW_Calc.getTranslation(46) + '</span></br><img width="25px" src="' + TW_Calc.imgUrl + '/images/window/duels/charclass_' + Character.charClass + '.png"><span id="TWCalc_charclass"></span></br><span id="TWCalc_Lang_level" style="font-weight:bold;font-size:large;width:190px;">' + TW_Calc.getTranslation(45) + '</span></br><span>' + Character.level + '<span></br><span id="TWCalc_Lang_server_info" style="font-weight:bold;display:inline-block;font-size:large;width:190px;">' + TW_Calc.getTranslation(52) + '</span></br><span id="TWCalc_server_info" style="width:190px;display:inline-block"></span></div>';

                var Tab2_4 = '<div>BB Code: <input type="text" class="input_layout" readonly="readonly" style="text-align:center;width:600px" id="TWCalc_battle_bbcode" value="" onclick="this.select();"></div>';

                var Tab4_HTML = '<div style="position:absolute;width:100%;height:100%;top:5px"></div>';

                var Tab4_1 = '<span style="font-weight:bold;font-size:16px">' + TW_Calc.getTranslation(63) + '</span></br><img src="' + TW_Calc.imgUrl + '/images/icons/user.png"><span style="font-weight:bold;">' + TW_Calc.getTranslation(66) + '</span><span class="tw2gui_textfield"><span><input type="text" size="3" value="' + (TW_Calc.functions.cookie.data.level || 1) + '" id="twcalc_duel_level"></span></span>' + '</br><div style="width:200px;margin:5px;" class="tw2gui_button" onclick="TW_Calc.TWDuelCalc.calc();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div  class="textart_title" style="font-weight:bold; font-style: normal; font-variant: normal; font-size: 10pt; line-height: normal; font-family: Arial; ">' + TW_Calc.getTranslation(67) + '</div></div></br>' + '<span style="font-weight:bold;">' + TW_Calc.getTranslation(69) + ':</span><span id="TWCalc_minduellevel"></span></br><span style="font-weight:bold;">' + TW_Calc.getTranslation(68) + ':</span><span id="TWCalc_maxduellevel"></span></br>';

                var Tab4_2 = '<span style="font-weight:bold;font-size:16px">' + TW_Calc.getTranslation(64) + '</span></br><img src="' + TW_Calc.imgUrl + '/images/icons/user.png"><span style="font-weight:bold;">' + TW_Calc.getTranslation(66) + '</span><span class="tw2gui_textfield"><span><input type="text" size="3" value="' + (TW_Calc.functions.cookie.data.level1 || 1) + '" id="twcalc_duel_level1"></span></span></br><img src="' + TW_Calc.imgUrl + '/images/icons/user.png"><span style="font-weight:bold;">' + TW_Calc.getTranslation(70) + '</span><span class="tw2gui_textfield"><span><input type="text" size="3" value="' + (TW_Calc.functions.cookie.data.level2 || 1) + '" id="twcalc_duel_level2"></span></span></br><img src="images/job/motivation.png"><span style="font-weight:bold;">' + TW_Calc.getTranslation(71) + '</span><span class="tw2gui_textfield"><span><input type="text" size="3" value="' + (TW_Calc.functions.cookie.data.motivation || 100) + '" id="twcalc_duel_motivation"></span></span></br></div>' + '<div style="width:200px;margin:5px;" class="tw2gui_button" onclick="TW_Calc.TWDuelCalc.calc_2();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold; font-style: normal; font-variant: normal; font-size: 10pt; line-height: normal; font-family: Arial; ">' + TW_Calc.getTranslation(67) + '</div></div></br><span style="font-weight:bold" id="TWCalc_exp"></span>';

                var Tab7_HTML = '<div id="TW_Calc_Api_Card" style="margin:10px 6px 6px 6px"></div>';

                var window = wman.open(id).setTitle("The-West Calc").setMiniTitle("TW-Calc");

                window.addTab("Notepad", 'twcalc1', tabclick).addTab("Battle Calc", "twcalc2", tabclick).addTab("My Battle stats", "twcalc3", tabclick).addTab("Duel Calc", "twcalc4", tabclick).addTab("Import", "twcalc5", tabclick).addTab("Duel list", "twcalc6", tabclick).addTab("Tombola", "twcalc8", tabclick).addTab("Settings", "twcalc7", tabclick);

                window.appendToContentPane($('<div id="tab_twcalc1">' + Tab1_HTML + '</div><div id="tab_twcalc2" style="display:none;overflow:hidden">' + Tab2_HTML + '</div><div id="tab_twcalc3" style="display:none;overflow:hidden">' + Tab3_HTML + '</div><div id="tab_twcalc4" style="display:none;overflow:hidden">' + Tab4_HTML + '</div><div id="tab_twcalc5" style="display:none;overflow:hidden"></div><div id="tab_twcalc6" style="display:none;overflow:hidden"></div><div id="tab_twcalc7" style="display:none;overflow:hidden">' + Tab7_HTML + '</div><div id="tab_twcalc8" style="display:none;overflow:hidden;height:100%;margin-top:6px;margin-left:6px;margin-right:6px;"></div>'));

                $("#tab_twcalc3>#block1").append(new west.gui.Groupframe().appendToContentPane(Tab2_1).getMainDiv());
                $("#tab_twcalc3>#block2").append(new west.gui.Groupframe().appendToContentPane(Tab2_2).getMainDiv());
                $("#tab_twcalc3>#block3").append(new west.gui.Groupframe().appendToContentPane(Tab2_3).getMainDiv());
                $("#tab_twcalc3>#block4").append(new west.gui.Groupframe().appendToContentPane(Tab2_4).getMainDiv());
                $("#tab_twcalc4>div").append(new west.gui.Groupframe().appendToContentPane(Tab4_1).getMainDiv());
                $("#tab_twcalc4>div").append(new west.gui.Groupframe().appendToContentPane(Tab4_2).getMainDiv());
                $("#tab_twcalc3>#block1>.tw2gui_groupframe").css({ "height": "105px", "width": "695px" });
                $("#tab_twcalc3>#block2>.tw2gui_groupframe").css({ "height": "205px", "width": "345px" });
                $("#tab_twcalc3>#block3>.tw2gui_groupframe").css({ "height": "205px", "width": "345px" });
                $("#tab_twcalc3>#block4>.tw2gui_groupframe").css({ "height": "48px", "width": "695px" });

                TW_Calc.showTab("twcalc1");
                $(".tw2gui_window.tw2gui_win2.TWcalc_window_").addClass("noreload");

                try
                {
                    TW_Calc.launch_card();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(launch_card').show();
                }

                try
                {
                    TW_Calc.TWBattleCalc.launch();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(TWBattleCalc.launch)').show();
                }

                try
                {
                    TW_Calc.TWBattleCalc.calc();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(TWBattleCalc.calc)').show();
                }

                try
                {
                    TW_Calc.TWDuelCalc.launch();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(TWDuelCalc.launch)').show();
                }

                try
                {
                    TW_Calc.TWDuelCalc.calc();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(TWDuelCalc.calc)').show();
                }

                try
                {
                    TW_Calc.TWDuelCalc.calc_2();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(TWDuelCalc.calc_2)').show();
                }

                try
                {
                    TW_Calc.duel_list.launch();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(duel_list.launch)').show();
                }

                try
                {
                    TW_Calc.duel_list.f.css();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(duel_list.f.css)').show();
                }

                try
                {
                    TW_Calc.Settings.launch();
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'launch(Settings.launch)').show();
                }

                $(".tw2gui_window_tab._tab_id_twcalc6").click(TW_Calc.duel_list.f.duel_table);

                $(".tw2gui_window_tab._tab_id_twcalc5").click(TW_Calc.import_inf);

                $(".tw2gui_window_tab._tab_id_twcalc8").click(TW_Calc.TombolaExporter.Tab.launch);

            };

            TW_Calc.launch_card = function ()
            {
                var notepad_text = localStorage.getItem("TWCalc_notepad");
                document.getElementById("TW_Calc_Block").innerHTML = notepad_text;
            };

            TW_Calc.AlarmClock = function ()
            {

                var title = TW_Calc.getTranslation(83);
                var mytime = localStorage.getItem("TWCalc_alarmClock");
                var note = (TW_Calc.bool(localStorage.getItem("TWCalc_alarm")) !== false ? localStorage.getItem("TWCalc_alarm") : "-");
                var music = localStorage.getItem("TWCalc_alarmClock_sound");

                if ((localStorage.getItem("TWCalc_alarmClock_sound") === '') || (localStorage.getItem("TWCalc_alarmClock_sound") === null)) music = '//tw-calc.net/script/budik.mp3';

                date = new Date();
                mo = date.getMonth() + 1;
                d = date.getDate();
                h = date.getHours();
                m = date.getMinutes();

                if (m < 10) m = "0" + m;
                if (h < 10) h = "0" + h;
                if (mo < 10) mo = "0" + mo;
                if (d < 10) d = "0" + d;

                var actualtime = d + "." + mo + ". " + h + ":" + m;

                var msg = '<div><embed src="' + music + '" autostart="true" width="0" height="0"><span>' + TW_Calc.getTranslation(82) + '</span>: <span>' + actualtime + '</span><br /><span>' + TW_Calc.getTranslation(81) + '</span><br /><span>' + note + '</span></div>';

                if (mytime === actualtime)
                {

                    new west.gui.Dialog(title, msg, west.gui.Dialog.SYS_WARNING).addButton('Ok', function () {}).show();
                    localStorage.setItem("TWCalc_alarmClock", "");

                }
            };

            TW_Calc.exp_hp_enrgy = function ()
            {

                var f = Character.getExperience4Level() - Character.getMaxExperience4Level();
                var a = '(' + f + ')';

                if (Boolean(f) === false) a = '';

                if (Number($('#ui_experience_bar').attr("xp")) != Character.getExperience4Level())
                {

                    $('#ui_experience_bar').attr("xp", Character.getExperience4Level());

                    $('#ui_experience_bar').addMousePopup(TW_Calc.getTranslation(103) + ':' + ' ' + Character.getExperience4Level() + ' / ' + Character.getMaxExperience4Level() + ' ' + a);

                }

                var regen_hp = Character.healthRegen * Character.maxHealth;
                var hp_max = Character.maxHealth;
                var actual_hp = Character.health;
                var hp_left = hp_max - actual_hp;
                var hp_time = hp_left / regen_hp;
                var hp_hour = Math.floor(hp_time);
                var hp_minute = Math.floor((hp_time - hp_hour) * 60);
                var m = Character.health - Character.maxHealth;

                if (Number($('#ui_character_container > .health_bar').attr("health")) != Character.health)
                {

                    $('#ui_character_container > .health_bar').attr("health", Character.health);

                    $('#ui_character_container > .health_bar').text(Character.health + ' / ' + Character.maxHealth + ' (' + m + ')').addMousePopup(TW_Calc.getTranslation(98) + ': ' + Character.health + ' / ' + Character.maxHealth + ' (' + m + '), ' + TW_Calc.getTranslation(104) + ' ' + hp_hour + ' ' + TW_Calc.getTranslation(101) + ' ' + hp_minute + ' ' + TW_Calc.getTranslation(102));

                }

                var regen_energy = 0.03;

                if (regen_energy === Character.energyRegen) regen_energy = 3;

                if (regen_energy < Character.energyRegen) regen_energy = Math.floor(Character.energyRegen * 100);

                var energy = Character.energy;
                var energy_max = Character.maxEnergy;
                var energy_left = energy_max - energy;

                var c = Character.energyRegen * 100;
                var time = energy_left / regen_energy;
                var hour = Math.floor(time);
                var minute = Math.floor((time - hour) * 60);
                var n = Character.energy - Character.maxEnergy;

                if (Number($('#ui_character_container > .energy_bar').attr("energy")) != Character.energy)
                {

                    $('#ui_character_container > .energy_bar').attr("energy", Character.energy);

                    $('#ui_character_container > .energy_bar').text(Character.energy + ' / ' + Character.maxEnergy + ' (' + n + ')').addMousePopup(TW_Calc.getTranslation(200) + ': ' + Character.energy + ' / ' + Character.maxEnergy + ' (' + n + '), ' + TW_Calc.getTranslation(100) + ': ' + hour + ' ' + TW_Calc.getTranslation(101) + ' ' + minute + ' ' + TW_Calc.getTranslation(102));

                }

            };

            TW_Calc.addCalcFees = function ()
            {

                try
                {
                    if (BankWindow.DOM != '*')
                    {

                        var bank_fee = Math.round($("#amount").val() / 100 * BankWindow.Transfer.fee);
                        var transfered_amout = Math.round($("#amount").val() - bank_fee);

                        $('div.bank-transfer-info div.tw2gui_groupframe_content_pane', BankWindow.DOM).empty().append(TW_Calc.getTranslation(105) + ': ' + BankWindow.Transfer.fee + '% <span style="font-size: 9px">(' + TW_Calc.getTranslation(106) + ': - $' + format_money(bank_fee) + ', ' + TW_Calc.getTranslation(107) + ': $' + format_money(transfered_amout) + ')</span>');
                    }

                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'TW_Calc.addCalcFee').show();
                }
            };

            TW_Calc.info = {
                open_forum: "'http://forum.the-west.sk/member.php?u=6556'",
                name: "The-West Calc",
                actualtime: function ()
                {

                    date = new Date();

                    mo = date.getMonth() + 1;
                    d = date.getDate();
                    h = date.getHours();
                    m = date.getMinutes();

                    if (m < 10) m = "0" + m;
                    if (h < 10) h = "0" + h;
                    if (mo < 10) mo = "0" + mo;
                    if (d < 10) d = "0" + d;

                    return d + "." + mo + ". " + h + ":" + m;

                }
            };

            TW_Calc.TWBattleCalc = {};

            TW_Calc.TWBattleCalc.launch = function ()
            {

                var frame1 = '<span style="font-weight:bold;font-size:large;">' + TW_Calc.getTranslation(4) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(9) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t5 || 0) + '" id="t5"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(8) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t4 || 0) + '" id="t4"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(193) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t2 || 0) + '" id="t2"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(6) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t3 || 0) + '" id="t3"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(5) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t1 || 0) + '" id="t1"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(29) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t11 || 0) + '" id="t11"></span></span></span>';

                var frame2 = '<div style="font-weight:bold;font-size:large;">' + TW_Calc.getTranslation(32) + '</div>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(30) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t12 || 1) + '" id="t12"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(201) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t13 || "50-110") + '" id="t13"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(32) + '</span><span id="tw_calc_combox_character"></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(18) + '</span><span id="tw_calc_combox" style="display:inline-block"></span></br></div>';

                var frame3 = '<div style="font-weight:bold;font-size:large;color:black;">' + TW_Calc.getTranslation(202) + '</div>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(14) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t14 || 0) + '" id="t14"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(51) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t15 || 0) + '" id="t15"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(140) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t16 || 0) + '" id="t16"></span></span></span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:100px;">' + TW_Calc.getTranslation(141) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" size="5" value="' + (TW_Calc.functions.cookie.data.t17 || 0) + '" id="t17"></span></span></span></br>';

                var frame4 = '<span style="font-weight:bold; font-size:large;color:red;width:100px;">' + TW_Calc.getTranslation(31) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(14) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/attacker_primary.png"></span></span><span id="t6">0</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(51) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold; width:20px;"><center><img src="' + TW_Calc.imgUrl + '/images/fort/battle/defender_secondary.png"></center></span><span id="t7">0</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(140) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/resistance.png"></span></span><span id="resistance_attack">0</span></br>' +
                    '<span style="font-weight:bold;font-size:large;color:blue;width:100px;">' + TW_Calc.getTranslation(33) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(14) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/attacker_primary.png"></span><span id="t8">0</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(51) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:20px;"><center><img src="' + TW_Calc.imgUrl + '/images/fort/battle/defender_secondary.png"></center></span><span id="t9">0</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:150px;">' + TW_Calc.getTranslation(140) + '</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;width:20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/resistance.png"></span></span><span id="resistance_defence">0</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;font-size:large;width:150px;">' + TW_Calc.getTranslation(28) + '</span></br><span id="t10">0</span></br>' +
                    '<span style="display:inline-block;font-weight:bold;font-size:large;width:250px;">' + TW_Calc.getTranslation(141) + '</span></br><span id="damage1">0</span>';

                $("#battle_calc").html("<div id='div_left' style='width:350px;height:100%;position:absolute;top:0px;left:0px;'></div><div id='div_right' style='width:340px;height:100%;position:absolute;top:0px;right:0px;'></div>");

                $("#battle_calc>#div_left").append(new west.gui.Scrollpane().appendContent('<div id="frame1" style="position: relative;"></div><div id="frame2" style="position:relative;"></div><div id="frame3" style="position:relative;"></div>').getMainDiv());
                $("#battle_calc>#div_right").append(new west.gui.Scrollpane().appendContent('<div id="frame4" style="position: relative;"></div>').getMainDiv()).append('<div class="tw2gui_button" style="position:absolute;bottom:0px;right:30px;" onclick="TW_Calc.TWBattleCalc.calc();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div id="TWCalc_lang_button" class="textart_title" style="font-weight:bold;">' + TW_Calc.getTranslation(27) + '</div></div>');

                var selector = $("#battle_calc>#div_left>.tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane");

                $($("#frame1"), selector).append(new west.gui.Groupframe().appendToContentPane(frame1).getMainDiv());

                $($("#frame2"), selector).append(new west.gui.Groupframe().appendToContentPane(frame2).getMainDiv());

                $($("#frame3"), selector).append(new west.gui.Groupframe().appendToContentPane(frame3).getMainDiv());

                $($("#frame4"), selector).prepend(new west.gui.Groupframe().appendToContentPane(frame4).getMainDiv());

                var check_boxes = [
                    ["premium", TW_Calc.getTranslation(2)],
                    ["my_tower", TW_Calc.getTranslation(20)],
                ];

                for (var i = 0; i < check_boxes.length; i++)
                {
                    $($("#frame2>div>div.tw2gui_groupframe_content_pane"), selector).append(new west.gui.Checkbox().setId(check_boxes[i][0]).setSelected(false).getMainDiv()).append('<span style="margin-left:5px;font-weight:bold;">' + check_boxes[i][1] + '</span></br>');
                }

                var combox = new west.gui.Combobox('TWCalc_Character')
                    .setWidth(100)
                    .addItem('greenhorn', TW_Calc.getTranslation(38))
                    .addItem('soldier', TW_Calc.getTranslation(41))
                    .addItem('worker', TW_Calc.getTranslation(42))
                    .addItem('duelist', TW_Calc.getTranslation(39))
                    .addItem('adventurer', TW_Calc.getTranslation(40))
                    .select('greenhorn').getMainDiv();

                $("#tw_calc_combox_character").append(combox);

                var combox2 = new west.gui.Combobox('TWCalc_Place')
                    .setWidth(100)
                    .addItem(0, TW_Calc.getTranslation(21))
                    .addItem(1, TW_Calc.getTranslation(22) + ' 1')
                    .addItem(2, TW_Calc.getTranslation(22) + ' 2')
                    .addItem(3, TW_Calc.getTranslation(22) + ' 3')
                    .addItem(4, TW_Calc.getTranslation(22) + ' 4')
                    .addItem(5, TW_Calc.getTranslation(22) + ' 5')
                    .addItem(11, TW_Calc.getTranslation(203) + ' 1')
                    .addItem(12, TW_Calc.getTranslation(203) + ' 2')
                    .addItem(13, TW_Calc.getTranslation(203) + ' 3')
                    .addItem(14, TW_Calc.getTranslation(203) + ' 4')
                    .addItem(15, TW_Calc.getTranslation(203) + ' 5').select(0).getMainDiv();

                $("#tw_calc_combox").append(combox2);

                $("#battle_calc").find(".tw2gui_textfield>span>input").change(function ()
                {
                    TW_Calc.functions.cookie.data[this.id] = $(this).val();
                    TW_Calc.functions.cookie.save();
                });

            };

            TW_Calc.TWBattleCalc.calc = function ()
            {

                var input = {
                    charClass: $('#TWCalc_Character_value').val(),
                    premium: $(".tw2gui_checkbox#premium").hasClass("tw2gui_checkbox_checked"),
                    level: Number($("#t12").val()),
                    skills:
                        {
                            health: Number($('#t11').val()),
                            leadership: Number($('#t1').val()),
                            pitfall: Number($('#t2').val()),
                            hide: Number($('#t3').val()),
                            dodge: Number($('#t4').val()),
                            aim: Number($('#t5').val())
                        },
                    map_position: $('#TWCalc_Place_value').val(),
                    char_tower: $(".tw2gui_checkbox#my_tower").hasClass("tw2gui_checkbox_checked"),
                    damage: $('#t13').val().split('-'),
                    bonus:
                        {
                            attack: Number($('#t14').val()),
                            defense: Number($('#t15').val()),
                            resistance: Number($('#t16').val()),
                            damage: Number($('#t17').val())
                        }
                };

                var data = BattleCalc.coreCalc(input);

                $("#t6").text(data.attack.hit);
                $("#t7").text(data.attack.dodge);
                $("#t8").text(data.defense.hit);
                $("#t9").text(data.defense.dodge);
                $("#t10").text(data.health + " HP");
                $("#resistance_attack").text(data.attack.resistance);
                $("#resistance_defence").text(data.defense.resistance);
                $("#damage1").text(data.damage);
            };

            TW_Calc.functions = {};

            TW_Calc.functions.extend = function (obj, src)
            {
                for (var key in src)
                {
                    if (src.hasOwnProperty(key)) obj[key] = src[key];
                }
                return obj;
            };

            TW_Calc.functions.ComboxChange = function (id, callback)
            {

                $("#TWCalc_" + id + "_value").on('change', TW_Calc.Settings.save);

                $("#TWCalc_" + id).click(function ()
                {
                    $(".tw2gui_combobox_list>.tw2gui_groupframe>.tw2gui_groupframe_content_pane>span").click(function ()
                    {
                        $("#TWCalc_" + id + "_value").trigger('change');
                    });
                });

                if (typeof (callback) != "undefined") callback();

            };

            TW_Calc.functions.edit_note = function ()
            {

                var cancel = function () {};

                var ok = function ()
                {

                    var note = document.getElementById("tw_calc_note").value;

                    localStorage.setItem("TWCalc_alarm", note);

                    MessageSuccess(TW_Calc.getTranslation(96)).show();

                };

                var p = '';

                if (TW_Calc.bool(localStorage.getItem("TWCalc_alarm")) !== false)
                {
                    p = localStorage.getItem("TWCalc_alarm");
                }

                new west.gui.Dialog(TW_Calc.getTranslation(93), '<span class="tw2gui_textarea" style="display:inline-block;"><div class="tw2gui_bg"></div><div class="tw2gui_bg_tl"></div><div class="tw2gui_bg_br"></div><div class="tw2gui_bg_tr"></div><div class="tw2gui_bg_bl"></div><div class="tw2gui_textarea_wrapper"><textarea id="tw_calc_note" style="width:380px;height:100px;">' + p + '</textarea></div></span>').addButton('ok', ok).addButton(TW_Calc.getTranslation(92), cancel).show();

            };

            TW_Calc.functions.AlarmClock = function ()
            {

                var all_text = document.getElementById("Wt3").value;

                localStorage.setItem("TWCalc_alarmClock", all_text);
                all_text.toString();

                var status = true;

                if (all_text.charAt(2) != '.') status = false;
                if (all_text.charAt(5) != ".") status = false;
                if (all_text.charAt(9) != ":") status = false;
                if (all_text.charAt(6) != " ") status = false;

                if (Number(all_text.substr(0, 2)) > 31) status = false;
                if (Number(all_text.substr(3, 2)) > 12) status = false;
                if (Number(all_text.substr(7, 2)) > 23) status = false;
                if (Number(all_text.substr(10, 2)) > 59) status = false;

                if (status === true)
                {
                    MessageSuccess(TW_Calc.getTranslation(91)).show();
                }
                else
                {
                    MessageError(TW_Calc.getTranslation(90)).show();
                }
            };

            TW_Calc.functions.save_notepad_text = function ()
            {

                var all_text = document.getElementById("TW_Calc_Block").value;
                localStorage.setItem("TWCalc_notepad", all_text);
                MessageSuccess(TW_Calc.getTranslation(88)).show();

            };

            TW_Calc.functions.confirm_deleting = function ()
            {

                var ok = function ()
                {
                    TW_Calc.functions.delete_notepad_text();
                };

                new west.gui.Dialog(TW_Calc.getTranslation(123), TW_Calc.getTranslation(123)).addButton('ok', ok).addButton('cancel').show();
            };

            TW_Calc.functions.delete_notepad_text = function ()
            {

                localStorage.setItem("TWCalc_notepad", "");
                document.getElementById("TW_Calc_Block").value = "";
                MessageSuccess(TW_Calc.getTranslation(89)).show();

            };

            TW_Calc.functions.settings = function ()
            {

                var alarmClock = localStorage.getItem("TWCalc_alarmClock_sound");

                if (alarmClock === null) alarmClock = 'Alarm1';

                if (alarmClock == "//tw-calc.net/script/budik.mp3") alarmClock = "Alarm1";

                if (alarmClock == "//tw-calc.net/script/budik2.mp3") alarmClock = "Alarm2";

                var ok = function ()
                {

                    var all_text1 = $("#TWCalc_AlarmClockText").val();
                    localStorage.setItem("TWCalc_alarmClock_sound", all_text1);

                    if (all_text1 == "Alarm1")
                    {
                        localStorage.setItem("TWCalc_alarmClock_sound", "//tw-calc.net/script/budik.mp3");
                    }

                    if (all_text1 == "Alarm2")
                    {
                        localStorage.setItem("TWCalc_alarmClock_sound", "//tw-calc.net/script/budik2.mp3");
                    }

                    MessageSuccess(TW_Calc.getTranslation(96)).show();

                };

                var zrus = function () {};

                var msg = '<div><span>' + TW_Calc.getTranslation(94) + '<span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="text" id="TWCalc_AlarmClockText" size="20" value="' + alarmClock + '"></span></span></span></br><span>' + TW_Calc.getTranslation(95) + '</span></div></br><span>' + TW_Calc.getTranslation(97) + '</span>';

                new west.gui.Dialog(TW_Calc.getTranslation(93), msg)
                    .addButton('ok', ok)
                    .addButton(TW_Calc.getTranslation(92), zrus)
                    .show();
            };

            TW_Calc.functions.cookie = {

                data: {},

                save: function ()
                {

                    var date = new Date();

                    date.setFullYear(date.getFullYear() + 1);

                    document.cookie = 'TWCalc=' + encodeURIComponent(JSON.stringify(this.data)) + '; expires=' + date.toUTCString();
                },

                load: function ()
                {
                    this.data = JSON.parse(decodeURIComponent(((document.cookie + ';').match(/TWCalc=([^;]*);/) || {})[1] || "%7B%7D"));
                }

            };

            TW_Calc.functions.isWearing = function (id)
            {

                var wear = Wear.wear;
                var state = false;

                for (var k in wear)
                {
                    var i = wear[k].getId();
                    if (i == id)
                    {
                        state = true;
                        break;
                    }
                }

                return state;
            };

            TW_Calc.TWCalcMyinfo = {};

            TW_Calc.TWCalcMyinfo.launch = function ()
            {

                var input = {
                    charClass: Character.charClass,
                    premium: Premium.hasBonus('character'),
                    level: Character.level,
                    skills:
                        {
                            health: CharacterSkills.skills.health.getPointsWithBonus(),
                            leadership: CharacterSkills.skills.leadership.getPointsWithBonus(),
                            pitfall: CharacterSkills.skills.pitfall.getPointsWithBonus(),
                            hide: CharacterSkills.skills.hide.getPointsWithBonus(),
                            dodge: CharacterSkills.skills.dodge.getPointsWithBonus(),
                            aim: CharacterSkills.skills.aim.getPointsWithBonus()
                        },
                    map_position: 0,
                    char_tower: false,
                    damage: [0, 0],
                    bonus:
                        {
                            attack: 0,
                            defense: 0,
                            resistance: 0,
                            damage: 0
                        }
                };

                var data = BattleCalc.coreCalc(input, true);

                $("#twcalc_hide_value").text(input.skills.hide);
                $("#twcalc_dodge_value").text(input.skills.dodge);
                $("#twcalc_pitfall_value").text(input.skills.pitfall);
                $("#twcalc_aim_value").text(input.skills.aim);
                $("#twcalc_leadership_value").text(input.skills.leadership);
                $("#twcalc_health_value").text(input.skills.health);

                $("#tw_t6").text(data.attack.hit);
                $("#tw_t7").text(data.attack.dodge);
                $("#tw_t8").text(data.defense.hit);
                $("#TW_t9").text(data.defense.dodge);
                $("#TW_t10").text(data.health);

                $("#TWCalc_name").text(Character.name + " (id= " + Character.playerId + ")");

                $("#tw_odpor1").text(data.attack.resistance);
                $("#tw_odpor2").text(data.defense.resistance);
                $("#TW_dmg_weapon").text(data.damage);
                $("#TWCalc_charclass").text(Game.InfoHandler.getLocalString4Charclass(Character.charClass));
                $("#TWCalc_server_info").text(Game.worldName + ",   (" + window.location.host + ") ");

                $("#TWCalc_battle_bbcode").val("[QUOTE][LIST][*][B]" + TW_Calc.getTranslation(43) + ":[/B] " + Character.name + "[*][B]" + TW_Calc.getTranslation(44) + ":[/B] " + Game.worldName + ",   (" + window.location.host + ")[*][B]" + TW_Calc.getTranslation(45) + ":[/B] " + Character.level + "[*][B]" + TW_Calc.getTranslation(46) + ":[/B] " + Game.InfoHandler.getLocalString4Charclass(Character.charClass) + "[*]••••••••••••••••[*][B]" + TW_Calc.getTranslation(31) + "[/B][*][B]" + TW_Calc.getTranslation(50) + "[/B][*]" + data.attack.hit + "[*][B]" + TW_Calc.getTranslation(51) + "[/B][*]" + data.attack.dodge + "[*][B]" + TW_Calc.getTranslation(33) + "[/B][*][B]" + TW_Calc.getTranslation(50) + "[/B][*]" + data.defense.hit + "[*][B]" + TW_Calc.getTranslation(51) + "[/B][*]" + data.defense.dodge + "[*][B]" + TW_Calc.getTranslation(49) + ":[/B]" + data.health + "[/LIST][/QUOTE]");

            };

            TW_Calc.Settings = {};

            TW_Calc.Settings.getCaption = function (id)
            {

                var i = 0;

                for (i; i < TW_Calc.Settings.list.length; i++)
                {

                    if (TW_Calc.Settings.list[i][0] === id) break;

                }

                return TW_Calc.Settings.list[i][1];

            };

            TW_Calc.Settings.launch = function ()
            {

                try
                {

                    var div = "#TW_Calc_Api_Card";

                    $(div).empty();

                    var i = 0;

                    for (i; i < TW_Calc.Settings.list.length; i++)
                    {

                        if (TW_Calc.Settings.list[i][2] !== true) $(div).append(new west.gui.Checkbox().setId(TW_Calc.Settings.list[i][0]).setSelected(TW_Calc.Settings.get(TW_Calc.Settings.list[i][0])).getMainDiv().click(TW_Calc.Settings.save)).append('&nbsp;' + TW_Calc.Settings.list[i][1] + '</br>');

                    }

                    $(div).append('</br>');


                    var combox_id = "topBar";
                    var combox = new west.gui.Combobox('TWCalc_' + combox_id)
                        .setWidth(100)
                        .addItem(1, TW_Calc.getTranslation(187))
                        .addItem(2, TW_Calc.getTranslation(186))
                        .addItem(3, TW_Calc.getTranslation(188))
                        .addItem(4, TW_Calc.getTranslation(189)).select(TW_Calc.Settings.get(combox_id, "number")).getMainDiv();

                    $(div).append('<span id="' + combox_id + '_text">' + TW_Calc.Settings.getCaption(combox_id) + ':</span> ')
                        .append(combox);
                    TW_Calc.functions.ComboxChange(combox_id);

                    $(div).append('</br>');

                    var combox_id2 = "duelBar";
                    var combox2 = new west.gui.Combobox('TWCalc_' + combox_id2)
                        .setWidth(100)
                        .addItem(1, TW_Calc.getTranslation(186))
                        .addItem(2, TW_Calc.getTranslation(187))
                        .addItem(4, TW_Calc.getTranslation(189)).select(TW_Calc.Settings.get(combox_id2, "number")).getMainDiv();

                    $(div).append('<span id="' + combox_id2 + '_text">' + TW_Calc.Settings.getCaption(combox_id2) + ':</span> ')
                        .append(combox2);
                    TW_Calc.functions.ComboxChange(combox_id2);


                    $(div).append('<p style="text-align:right;margin-bottom:5px">Refresh the page to apply changes. <b>(F5)</b></p>')
                        .append('<hr>')
                        .append('</br>')
                        .append(new west.gui.Button().setCaption(TW_Calc.getTranslation(62)).click(function ()
                        {
                            TW_Calc.functions.settings();
                        }).getMainDiv())
                        .append(new west.gui.Button().setCaption(TW_Calc.getTranslation(152)).click(function ()
                        {
                            TW_Calc.nearestJob.open();
                        }).getMainDiv())
                        .append(new west.gui.Button().setCaption('Errorlog').click(function ()
                        {
                            TW_Calc.ErrorLog.open();
                        }).getMainDiv())
                        .append('</br><div style="margin-top:5px;font-weight:bold;">Translated by ' + TW_Calc.lang.translator + '.&nbsp; Thanks for Translation! :) Script version: ' + TW_Calc.version + '</div>');

                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'Settings.launch').show();
                }
            };

            TW_Calc.Settings.open = function ()
            {

                try
                {
                    TW_Calc.launch();
                    TW_Calc.showTab('twcalc7');

                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'Settings.open').show();
                }

            };

            TW_Calc.Settings.get = function (name, type)
            {

                try
                {

                    if (TW_Calc.bool(localStorage.getItem("TWCalc_Settings")) !== false)
                    {

                        var data = localStorage.getItem("TWCalc_Settings");
                        data = $.parseJSON(data);

                        if (data.hasOwnProperty(name))
                        {

                            return data[name];

                        }
                        else
                        {

                            if (type != 'number') return true;
                            else return 1;

                        }

                    }
                    else
                    {

                        if (type != 'number') return true;
                        else return 1;

                    }

                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'Settings.get').show();
                }

            };

            TW_Calc.val = function (d)
            {

                var selector_button = "#" + d + ".tw2gui_checkbox";
                var selector_combox = $('#tab_twcalc7').find(".tw2gui_combobox#TWCalc_" + d + ">#TWCalc_" + d + "_value");

                if ($('#tab_twcalc7').find(selector_button).length !== 0)
                {

                    if ($(selector_button).hasClass("tw2gui_checkbox_checked")) return true;
                    else return false;

                }
                else if (selector_combox.length !== 0)
                {

                    var val = Number($(selector_combox).val());

                    return (val == null ? 1 : val);

                }

            };

            TW_Calc.Settings.save = function ()
            {

                try
                {

                    var obj = {};

                    var i = 0;

                    for (i; i < TW_Calc.Settings.list.length; i++)
                    {

                        obj[TW_Calc.Settings.list[i][0]] = TW_Calc.val(TW_Calc.Settings.list[i][0]);

                    }

                    data = JSON.stringify(obj);

                    localStorage.setItem("TWCalc_Settings", data);
                    MessageSuccess(TW_Calc.getTranslation(88)).show();

                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'Settings.save').show();

                }

            };

            TW_Calc.TWDuelCalc = {};

            TW_Calc.TWDuelCalc.launch = function ()
            {

                try
                {

                    TW_Calc.functions.cookie.load();

                    $('#twcalc_duel_level').change(function ()
                    {
                        TW_Calc.functions.cookie.data.level = $(this).val() * 1;
                        TW_Calc.functions.cookie.save();
                    });

                    $('#twcalc_duel_level1').change(function ()
                    {
                        TW_Calc.functions.cookie.data.level1 = $(this).val() * 1;
                        TW_Calc.functions.cookie.save();
                    });

                    $('#twcalc_duel_level2').change(function ()
                    {
                        TW_Calc.functions.cookie.data.level2 = $(this).val() * 1;
                        TW_Calc.functions.cookie.save();
                    });

                    $('#twcalc_duel_motivation').change(function ()
                    {
                        TW_Calc.functions.cookie.data.motivation = $(this).val() * 1;
                        TW_Calc.functions.cookie.save();
                    });

                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'TWDuelCalc.launch').show();
                }

            };

            TW_Calc.TWDuelCalc.calc = function ()
            {

                var levelval = Number($("#twcalc_duel_level").val());

                var maxduel = Math.floor(levelval * 1.4);
                var minduel = Math.ceil(levelval / 1.4);

                $("#TWCalc_maxduellevel").html(' ' + maxduel);
                $("#TWCalc_minduellevel").html(' ' + minduel);
            };

            TW_Calc.TWDuelCalc.calc_2 = function ()
            {

                var level1 = Number($("#twcalc_duel_level1").val());
                var level2 = Number($("#twcalc_duel_level2").val());

                var motivation = Number($("#twcalc_duel_motivation").val()) / 100;

                var duelxp = (7 * level2 - 5 * level1 + 5) * motivation;
                var xp = Math.round(duelxp) * 3;
                var lostxp = Math.round(duelxp / 3);

                $("#TWCalc_exp").html(TW_Calc.getTranslation(86) + " " + xp + " " + TW_Calc.getTranslation(87) + " " + Math.round(duelxp) + " " + TW_Calc.getTranslation(110) + " - " + TW_Calc.getTranslation(199) + " " + lostxp + " " + TW_Calc.getTranslation(110));

            };

            TW_Calc.import_inf = function ()
            {

                $.getScript(TW_Calc.website + "/public/import/doImport.js");

            };

            TW_Calc.duel_list = {};

            TW_Calc.duel_list.f = {};

            TW_Calc.duel_list.launch = function ()
            {

                $("#tab_twcalc6").css({ height: "100%", "margin-top": "6px", "margin-left": "6px", "margin-right": "6px" }).html(new west.gui.Scrollpane().appendContent('<div id="tab_twcalc6_scrollpane"></div>').getMainDiv());

                $("div#tab_twcalc6_scrollpane").append('<div id="duel_list" style="margin-top:5px"></div><div id="progressbar"></div>');

                $("div#progressbar").append(new west.gui.Groupframe().appendToContentPane('<div style="font-weight:bold">' + TW_Calc.getTranslation(71) + '</div>').appendToContentPane(new west.gui.Progressbar(Character.duelMotivation, 1).showPercentOnly(true).getMainDiv()).getMainDiv());

                TW_Calc.duel_list.f.css();

            };

            TW_Calc.duel_list.f.getPlayerAlliance = function (name, callback)
            {

                $.post('game.php?window=profile&mode=init', { name: encodeURIComponent(name) }, function (r)
                {
                    callback.call(window, r.playerid, (r.town && r.town.alliance_id >= 0 ? r.town.alliance_id : -1), r.playername, r.level, r.duelLevel, r.town, r.x, r.y, r.isDuelable, r.classKey);
                }, 'json');

            };

            TW_Calc.duel_list.f.duel_table = function ()
            {

                wman.getById("TWcalc_window_").showLoader();

                $.post('game.php?window=profile&mode=init', { name: encodeURIComponent(Character.name) }, function (r)
                {

                    TW_Calc.info.level = Number(r.duelLevel);

                    var maindiv = $("#duel_list");

                    $(maindiv).empty();

                    var table = new west.gui.Table();

                    table.setId('duel_list').createEmptyMessage('Empty').appendTo(maindiv);
                    table.addColumn("player_name").addColumn("player_level").addColumn("duel_level").addColumn("town").addColumn("duelable").addColumn("distance").addColumn("xp").addColumn("doduel");
                    table.appendToCell('head', 'player_name', TW_Calc.getTranslation(43)).appendToCell('head', 'player_level', '<img src="' + TW_Calc.duel_list.f.obr + '" title="' + TW_Calc.getTranslation(30) + '">').appendToCell('head', 'duel_level', '<img src="' + TW_Calc.duel_list.f.obr + '" title="' + TW_Calc.getTranslation(114) + '">').appendToCell('head', 'town', TW_Calc.getTranslation(118)).appendToCell('head', 'duelable', '<img src="' + TW_Calc.duel_list.f.obr + '" title="' + TW_Calc.getTranslation(115) + '">').appendToCell('head', 'distance', '<img src="' + TW_Calc.duel_list.f.obr + '" title="' + TW_Calc.getTranslation(116) + '">').appendToCell('head', 'xp', 'XP'.escapeHTML()).appendToCell('head', 'doduel', 'Duel'.escapeHTML());
                    table.appendToFooter('player_name', new west.gui.Button(TW_Calc.getTranslation(113), function () { TW_Calc.duel_list.f.edit(); }).getMainDiv());
                    table.appendToFooter('player_level', new west.gui.Button(TW_Calc.getTranslation(154), function () { DuelsWindow.open(); }).getMainDiv());

                    var player = '';

                    if (TW_Calc.bool(localStorage.getItem("TWCalc_duellist")) !== false)
                    {
                        player = localStorage.getItem("TWCalc_duellist").split(",");
                    }

                    var i = 0;

                    while (TW_Calc.bool(player[i]) !== false)
                    {

                        TW_Calc.duel_list.f.getPlayerAlliance(player[i], function (id, alliance, name, level, dlevel, town, x, y, isDuelable, postava)
                        {

                            var distance = Character.calcWayTo(x, y);
                            distance = distance.formatDuration();

                            var xp = Math.round(((7 * dlevel) - (5 * TW_Calc.info.level) + 5) * Character.duelMotivation * 3);

                            table.appendRow().appendToCell(-1, "player_name", '<img src="images/icons/center.png" title="' + TW_Calc.getTranslation(117) + '" style="cursor:pointer;margin-right:5px;margin-left:2px;" onclick="Map.center(' + x + ',' + y + ')"><img style="margin-right:2px" width="20px" src="' + TW_Calc.imgUrl + '/images/window/duels/charclass_' + postava + '.png" style=""><a href="javascript: PlayerProfileWindow.open(' + id + ');">' + name + '</a>').appendToCell(-1, "player_level", level).appendToCell(-1, "duel_level", dlevel).appendToCell(-1, "town", (town == null ? '-' : '<a href="javascript:TownWindow.open(' + town.town_x + ',' + town.town_y + ')">' + town.name + '</a>')).appendToCell(-1, "duelable", '<img src="' + TW_Calc.imgUrl + '/images/window/dailyactivity/' + (isDuelable === true ? 'positive' : 'negative') + '.png">').appendToCell(-1, "distance", distance).appendToCell(-1, "xp", xp).appendToCell(-1, "doduel", '<a href="javascript: TaskQueue.add(new TaskDuel(' + id + '));">Duel</a>');

                            TW_Calc.duel_list.f.css();
                        });

                        i++;
                    }

                    TW_Calc.duel_list.f.css();

                    wman.getById("TWcalc_window_").hideLoader();

                }, 'json');

            };

            TW_Calc.duel_list.f.css = function ()
            {

                $(".cell.cell_0.player_name").css({ "width": "190px" });
                $(".cell.cell_1.player_level").css({ "width": "30px" });
                $(".cell.cell_2.duel_level").css({ "width": "30px" });
                $(".cell.cell_3.town").css({ "width": "150px" });
                $(".cell.cell_4.duelable").css({ "width": "50px" });
                $(".cell.cell_5.distance").css({ "width": "70px" });
                $(".cell.cell_6.xp").css({ "width": "70px" });
                $(".cell.cell_7.doduel").css({ "width": "40px" });

            };

            TW_Calc.duel_list.f.obr = "data:image/png;base64,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";

            TW_Calc.duel_list.f.edit = function ()
            {

                function zrus() {}

                function save()
                {

                    var i = 0;
                    var save_text = '';

                    while (TW_Calc.bool(document.getElementById("list" + i)) !== false)
                    {
                        var value = document.getElementById("list" + i).value;
                        save_text = save_text + '' + value + ',';
                        i++;
                    }

                    localStorage.setItem("TWCalc_duellist", save_text);
                    MessageSuccess(TW_Calc.getTranslation(88)).show();
                    TW_Calc.duel_list.f.duel_table();

                }

                var list = '';
                //var err_msg = TW_Calc.getTranslation(124);
                if (TW_Calc.bool(localStorage.getItem("TWCalc_duellist")) !== false)
                {

                    list = localStorage.getItem("TWCalc_duellist");
                    list = list.split(",");

                }

                var i = 0;

                var msg = '<div id="list_players">';

                while (TW_Calc.bool(list[i]) !== false)
                {

                    msg = msg + '<div id="_list' + i + '" class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield"><span><input type="text" size="50" value="' + list[i] + '" id="list' + i + '"></span></span></div>';
                    i++;

                }

                var r = i - 1;

                new west.gui.Dialog(TW_Calc.getTranslation(113), msg + TW_Calc.duel_list.AddRemoveImg(r) + '</div>').addButton(TW_Calc.getTranslation(36), save).addButton(TW_Calc.getTranslation(92), zrus).show();

            };

            TW_Calc.duel_list.AddRemoveImg = function (i)
            {

                return '<a title="' + TW_Calc.getTranslation(35) + '" id="list_duels_delete" style="bottom: -20px;left: 0px;display:inline-block;margin-right:5px;background:url(' + TW_Calc.imgUrl + '/images/tw2gui/iconset.png);width:16px;height:16px;background-position: -48px 0px;" href="javascript: TW_Calc.duel_list.f.del(' + i + ')"></a><a title="' + TW_Calc.getTranslation(163) + '"" id="list_duels_click" style="bottom: -20px;left: 20px;display:inline-block;margin-right:5px;background:url(' + TW_Calc.imgUrl + '/images/tw2gui/iconset.png);width:16px;height:16px;background-position: -16px 80px" href="javascript: TW_Calc.duel_list.f.add(' + (i + 1) + ')"></a>';

            };

            TW_Calc.duel_list.f.add = function (i)
            {

                var p = document.getElementById("list_players");

                $("#list_duels_delete").remove();
                $("#list_duels_click").remove();

                var a = TW_Calc.duel_list.AddRemoveImg(i);
                $("#list_players").append('<div id="_list' + i + '" class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield"><span><input type="text" size="50" value="" id="list' + i + '"></span></span></div>' + a);

                i++;

                document.getElementById("list_duels_click").href = 'javascript: TW_Calc.duel_list.f.add(' + i + ')';

                $("#list_players>br").remove();
            };

            TW_Calc.duel_list.f.del = function (i)
            {

                var p = document.getElementById("list_players");
                var c = document.getElementById("_list" + i);

                p.removeChild(c);

                i = i - 1;
                document.getElementById("list_duels_delete").href = 'javascript: TW_Calc.duel_list.f.del(' + i + ')';

                var r = i + 1;

                document.getElementById("list_duels_click").href = 'javascript: TW_Calc.duel_list.f.add(' + r + ')';

                $("#list_players>br").remove();
            };

            TW_Calc.craft = {};

            TW_Calc.craft.openMyProffesion = function ()
            {

                TW_Calc.quest.window.launch();

                TW_Calc.quest.window.showTab('craft' + (Character.professionId - 1), function ()
                {
                    TW_Calc.craft.launch(Character.professionId - 1);
                });

            };

            TW_Calc.craft.professionsCache = [
                [
                    { "r": "20000000", "o": ["0", "50", "100"] },
                    { "r": "20001000", "o": ["0", "50", "100"] },
                    { "r": "20002000", "o": ["0", "50", "100"] },
                    { "r": "20083000", "o": ["0", "100", "100"] },
                    { "r": "20084000", "o": ["0", "10", "10"] },
                    { "r": "20085000", "o": ["10", "20", "20"] },
                    { "r": "20086000", "o": ["20", "40", "40"] },
                    { "r": "20003000", "o": ["50", "100", "100"] },
                    { "r": "20004000", "o": ["50", "100", "100"] },
                    { "r": "20005000", "o": ["100", "150", "200"] },
                    { "r": "20006000", "o": ["100", "150", "200"] },
                    { "r": "20007000", "o": ["100", "150", "200"] },
                    { "r": "20008000", "o": ["150", "225", "300"] },
                    { "r": "20009000", "o": ["150", "225", "300"] },
                    { "r": "20010000", "o": ["150", "225", "300"] },
                    { "r": "20011000", "o": ["250", "300", "300"] },
                    { "r": "20012000", "o": ["250", "300", "300"] },
                    { "r": "20013000", "o": ["250", "300", "300"] },
                    { "r": "20014000", "o": ["300", "350", "400"] },
                    { "r": "20015000", "o": ["350", "425", "500"] },
                    { "r": "20016000", "o": ["350", "425", "500"] },
                    { "r": "20017000", "o": ["350", "425", "500"] },
                    { "r": "20116000", "o": ["350", "425", "500"] },
                    { "r": "20134000", "o": ["450", "475", "500"] },
                    { "r": "20018000", "o": ["400", "500", "500"] },
                    { "r": "20019000", "o": ["450", "500", "500"] },
                    { "r": "20096000", "o": ["500", "525", "550"] },
                    { "r": "20120000", "o": ["500", "525", "550"] },
                    { "r": "20124000", "o": ["500", "525", "550"] },
                    { "r": "20097000", "o": ["525", "550", "575"] },
                    { "r": "20098000", "o": ["550", "575", "600"] },
                    { "r": "20135000", "o": ["550", "575", "600"] },
                    { "r": "20099000", "o": ["600", "625", "650"] },
                    { "r": "20100000", "o": ["600", "625", "650"] },
                    { "r": "20136000", "o": ["600", "650", "700"] }
                ],
                [
                    { "r": "20020000", "o": ["0", "50", "100"] },
                    { "r": "20021000", "o": ["0", "50", "100"] },
                    { "r": "20022000", "o": ["0", "100", "100"] },
                    { "r": "20081000", "o": ["0", "50", "100"] },
                    { "r": "20087000", "o": ["0", "10", "10"] },
                    { "r": "20088000", "o": ["10", "20", "20"] },
                    { "r": "20089000", "o": ["20", "40", "40"] },
                    { "r": "20023000", "o": ["50", "100", "100"] },
                    { "r": "20024000", "o": ["50", "100", "100"] },
                    { "r": "20025000", "o": ["100", "150", "200"] },
                    { "r": "20026000", "o": ["100", "150", "200"] },
                    { "r": "20027000", "o": ["100", "150", "200"] },
                    { "r": "20028000", "o": ["150", "225", "300"] },
                    { "r": "20029000", "o": ["150", "225", "300"] },
                    { "r": "20030000", "o": ["150", "225", "300"] },
                    { "r": "20031000", "o": ["250", "300", "300"] },
                    { "r": "20032000", "o": ["250", "300", "300"] },
                    { "r": "20033000", "o": ["250", "300", "300"] },
                    { "r": "20034000", "o": ["300", "350", "400"] },
                    { "r": "20035000", "o": ["350", "425", "500"] },
                    { "r": "20036000", "o": ["350", "425", "500"] },
                    { "r": "20037000", "o": ["350", "425", "500"] },
                    { "r": "20119000", "o": ["350", "425", "500"] },
                    { "r": "20038000", "o": ["400", "500", "500"] },
                    { "r": "20123000", "o": ["450", "475", "500"] },
                    { "r": "20128000", "o": ["450", "475", "500"] },
                    { "r": "20039000", "o": ["450", "500", "500"] },
                    { "r": "20101000", "o": ["500", "525", "550"] },
                    { "r": "20127000", "o": ["500", "525", "550"] },
                    { "r": "20102000", "o": ["525", "550", "575"] },
                    { "r": "20103000", "o": ["550", "575", "600"] },
                    { "r": "20129000", "o": ["550", "575", "600"] },
                    { "r": "20104000", "o": ["600", "625", "650"] },
                    { "r": "20105000", "o": ["600", "625", "650"] },
                    { "r": "20130000", "o": ["600", "650", "700"] }
                ],
                [
                    { "r": "20040000", "o": ["0", "50", "100"] },
                    { "r": "20041000", "o": ["0", "50", "100"] },
                    { "r": "20042000", "o": ["0", "100", "100"] },
                    { "r": "20082000", "o": ["0", "50", "100"] },
                    { "r": "20090000", "o": ["0", "10", "10"] },
                    { "r": "20091000", "o": ["10", "20", "20"] },
                    { "r": "20092000", "o": ["20", "40", "40"] },
                    { "r": "20043000", "o": ["50", "100", "100"] },
                    { "r": "20044000", "o": ["50", "100", "100"] },
                    { "r": "20045000", "o": ["100", "150", "200"] },
                    { "r": "20046000", "o": ["100", "150", "200"] },
                    { "r": "20047000", "o": ["100", "150", "200"] },
                    { "r": "20048000", "o": ["150", "225", "300"] },
                    { "r": "20049000", "o": ["150", "225", "300"] },
                    { "r": "20050000", "o": ["150", "225", "300"] },
                    { "r": "20051000", "o": ["250", "300", "300"] },
                    { "r": "20052000", "o": ["250", "300", "300"] },
                    { "r": "20053000", "o": ["250", "300", "300"] },
                    { "r": "20054000", "o": ["300", "350", "400"] },
                    { "r": "20055000", "o": ["350", "425", "500"] },
                    { "r": "20056000", "o": ["350", "425", "500"] },
                    { "r": "20057000", "o": ["350", "425", "500"] },
                    { "r": "20118000", "o": ["350", "425", "500"] },
                    { "r": "20058000", "o": ["400", "500", "500"] },
                    { "r": "20122000", "o": ["450", "475", "500"] },
                    { "r": "20131000", "o": ["450", "475", "500"] },
                    { "r": "20059000", "o": ["450", "500", "500"] },
                    { "r": "20111000", "o": ["500", "525", "550"] },
                    { "r": "20126000", "o": ["500", "525", "550"] },
                    { "r": "20112000", "o": ["525", "550", "575"] },
                    { "r": "20113000", "o": ["550", "575", "600"] },
                    { "r": "20132000", "o": ["550", "575", "600"] },
                    { "r": "20114000", "o": ["600", "625", "650"] },
                    { "r": "20115000", "o": ["600", "625", "650"] },
                    { "r": "20133000", "o": ["600", "650", "700"] }
                ],
                [
                    { "r": "20060000", "o": ["0", "50", "100"] },
                    { "r": "20061000", "o": ["0", "50", "100"] },
                    { "r": "20062000", "o": ["0", "100", "100"] },
                    { "r": "20080000", "o": ["0", "50", "100"] },
                    { "r": "20093000", "o": ["0", "10", "10"] },
                    { "r": "20094000", "o": ["10", "20", "20"] },
                    { "r": "20095000", "o": ["20", "40", "40"] },
                    { "r": "20063000", "o": ["50", "100", "100"] },
                    { "r": "20064000", "o": ["50", "100", "100"] },
                    { "r": "20065000", "o": ["100", "150", "200"] },
                    { "r": "20066000", "o": ["100", "150", "200"] },
                    { "r": "20067000", "o": ["100", "150", "200"] },
                    { "r": "20068000", "o": ["150", "225", "300"] },
                    { "r": "20069000", "o": ["150", "225", "300"] },
                    { "r": "20070000", "o": ["150", "225", "300"] },
                    { "r": "20071000", "o": ["250", "300", "300"] },
                    { "r": "20072000", "o": ["250", "300", "300"] },
                    { "r": "20073000", "o": ["250", "300", "300"] },
                    { "r": "20074000", "o": ["300", "350", "400"] },
                    { "r": "20075000", "o": ["350", "425", "500"] },
                    { "r": "20076000", "o": ["350", "425", "500"] },
                    { "r": "20077000", "o": ["350", "425", "500"] },
                    { "r": "20117000", "o": ["350", "425", "500"] },
                    { "r": "20078000", "o": ["400", "500", "500"] },
                    { "r": "20121000", "o": ["450", "475", "500"] },
                    { "r": "20137000", "o": ["450", "475", "500"] },
                    { "r": "20079000", "o": ["450", "500", "500"] },
                    { "r": "20106000", "o": ["500", "525", "550"] },
                    { "r": "20125000", "o": ["500", "525", "550"] },
                    { "r": "20107000", "o": ["525", "550", "575"] },
                    { "r": "20108000", "o": ["550", "575", "600"] },
                    { "r": "20138000", "o": ["550", "575", "600"] },
                    { "r": "20109000", "o": ["600", "625", "650"] },
                    { "r": "20110000", "o": ["600", "625", "650"] },
                    { "r": "20139000", "o": ["600", "650", "700"] }
                ],
                [
                    1855000, 1862000, 1856000, 1940000, 1941000, 1942000, 1943000, 1863000, 1864000, 1865000, 1866000, 1867000, 1868000, 1869000, 1870000, 1871000, 1872000, 1873000, 1874000, 1875000, 1876000, 1877000, 2516000, 2736000, 1878000, 1879000, 1980000, 2517000, 2518000, 1981000, 1982000, 2737000, 1999000, 2001000, 2738000, 1861000, 1881000, 1880000, 1939000, 1944000, 1945000, 1946000, 1882000, 1883000, 1884000, 1885000, 1886000, 1887000, 1888000, 1889000, 1890000, 1891000, 1892000, 1893000, 1894000, 1895000, 1896000, 2525000, 1897000, 2526000, 2730000, 1898000, 1983000, 2527000, 1984000, 1985000, 2731000, 2002000, 2004000, 2732000, 1859000, 1899000, 1858000, 1938000, 1947000, 1948000, 1949000, 1900000, 1901000, 1902000, 1903000, 1904000, 1905000, 1906000, 1907000, 1908000, 1909000, 1910000, 1911000, 1912000, 1913000, 1914000, 2522000, 1915000, 2523000, 2733000, 1916000, 1989000, 2524000, 1990000, 1991000, 2735000, 2008000, 2010000, 2734000, 1857000, 1917000, 1860000, 1937000, 1950000, 1951000, 1952000, 1918000, 1919000, 1920000, 1921000, 1922000, 1923000, 1924000, 1925000, 1926000, 1927000, 1928000, 1929000, 1930000, 1931000, 1932000, 2519000, 1933000, 2520000, 2739000, 1934000, 1986000, 2521000, 1987000, 1988000, 2740000, 2005000, 2007000, 2741000,
                ],
                [],
            ];

            Ajax.remoteCall('crafting', '', {}, function (json)
            {
                if (json.recipes_content)
                    for (var i = 0; i < json.recipes_content.length; i++)
                        TW_Calc.craft.professionsCache[5].push(json.recipes_content[i].item_id);
            });

            TW_Calc.craft.toggleReciepes = function (u)
            {

                var selector = ".TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_" + u + " > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane > div > .tw2gui_scrollpane_clipper > div >";

                if ($(selector + ".recipe_title>.recipe_title_inner>.recipe_collapse").html() == '+')
                {

                    $(selector + ".recipe_title>.recipe_title_inner>.recipe_collapse").html("-");
                    $(selector + ".recipe_content").slideDown();

                }
                else
                {

                    $(selector + ".recipe_title>.recipe_title_inner>.recipe_collapse").html("+");
                    $(selector + ".recipe_content").slideUp();

                }
            };

            TW_Calc.craft.startCraft = function (recipe_id)
            {

                var amount = Number($('#recipe_button_' + recipe_id + '>.displayValue').text());

                var craft_amount = amount * 1;

                Ajax.remoteCall('crafting', 'start_craft', { recipe_id: recipe_id, amount: craft_amount },
                    function (resp)
                    {

                        if (resp.error) return new MessageError(resp.msg).show();

                        var data = resp.msg;

                        Character.setProfessionSkill(data.profession_skill);

                        $('#recipe_difficult_' + recipe_id).removeClass('middle hard easy').addClass(Crafting.getRecipeColor(ItemManager.get(recipe_id)));

                        EventHandler.signal("inventory_changed");

                        Character.updateDailyTask('crafts', data.count);

                        TW_Calc.craft.reload();

                        $.getJSON("?window=inventory&action=inventory_changed&h=" + Player.h, complete = function ()
                        {
                            TW_Calc.craft.reload();
                        });

                        return new MessageSuccess(data.msg).show();
                    }
                );
            };

            TW_Calc.craft.ItemCraft = function (id, s, reciepeId, craftable)
            {

                var itemObj = ItemManager.get(reciepeId).resources[id];
                var item = {};

                if (typeof (itemObj.item) == "object") item.item = itemObj.item.item_id;
                else item.item = itemObj.item;

                item.count = itemObj.count;

                var bag_count = Bag.getItemCount(item.item);

                var mainDiv = new tw2widget.CraftingItem(ItemManager.get(item.item)).setRequired(bag_count, item.count).getMainDiv();

                var craft_recipe_data = { "inventory": {}, "required": {} };

                craft_recipe_data.inventory[item.item] = bag_count;
                craft_recipe_data.required[item.item] = item.count;

                var mmLink = Quest.getMinimapLink({ id: item.item, type: 'inventory_changed' });

                $(mainDiv).append($(mmLink).css({ 'display': 'block', 'width': '16px', 'position': 'relative', 'opacity': '1', 'left': '4px', 'bottom': '27px' }));

                $(s).append(mainDiv);

                if (craftable === true)
                    if (bag_count < item.count) craftable = false;

                return { craftable: craftable, craft_recipe_data: craft_recipe_data };

            };

            TW_Calc.craft.reload = function ()
            {

                try
                {
                    var id = 0;
                    for (var p = 0; p < 4; p++)
                    {
                        if ($(".TW-CALC-QUEST > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > .tw2gui_window_tab_active").hasClass("_tab_id_craft" + p))
                        {
                            id = p;
                        }
                    }

                    var u = "craft" + id;

                    TW_Calc.craft.craft = [];

                    if (TW_Calc.craft.input !== null)
                    {

                        TW_Calc.craft.craft[id] = TW_Calc.craft.input;

                    }
                    else
                    {

                        TW_Calc.craft.craft[id] = TW_Calc.craft.professionsCache[id];

                    }

                    var selector = ".TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_" + u + " > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane > div > .tw2gui_scrollpane_clipper > div";

                    var t = 0;

                    while (TW_Calc.bool(TW_Calc.craft.craft[id][t]) !== false)
                    {

                        var craft = TW_Calc.craft.craft[id][t];

                        var reciepeId = Number(craft.r);

                        var s = selector + '>#TW_CALC_recipe_content_' + craft.r + '>#recipe_resources_content_' + craft.r;

                        $(s).empty();

                        var craftable = true;

                        var resources = ItemManager.get(reciepeId).resources;

                        var _craft = TW_Calc.craft.ItemCraft;

                        for (var q = 0; q < resources.length; q++)
                            craftable = _craft(q, s, reciepeId, craftable).craftable;

                        if (craftable === false) $("#recipe_craft_" + craft.r).empty();

                        t++;

                    }

                    TW_Calc.craft.progressbar.setValue(Character.professionSkill);

                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'craft.reload').show();

                }
            };

            TW_Calc.craft.sortName = function ()
            {
                var position = $('#TW_Calc_Sort_Name')[0].selectionStart;
                var id = Character.professionId - 1;
                var val = $('#TW_Calc_Sort_Name').val();
                var input = [];
                var x = 0;

                while (TW_Calc.bool(TW_Calc.craft.nameListArray[x]) !== false)
                {

                    if (TW_Calc.craft.nameListArray[x].search(val.toLowerCase()) != -1)
                    {

                        input.push(TW_Calc.craft.nameList[TW_Calc.craft.nameListArray[x]]);

                    }

                    x++;
                }

                TW_Calc.craft.launch(id, input);

                $('#TW_Calc_Sort_Name').val(val);
                $('#TW_Calc_Sort_Name').focus();
                $('#TW_Calc_Sort_Name')[0].selectionStart = position;
            };

            TW_Calc.craft.sort = function ()
            {

                var id = Character.professionId - 1;
                var input = [];
                var checked = false;

                TW_Calc.craft.TW_Calc_Sort_Craftable = '';

                if ($('#TW_Calc_Sort_Craftable').hasClass('tw2gui_checkbox_checked'))
                {
                    input = input.concat(TW_Calc.craft.craftableList);
                    TW_Calc.craft.TW_Calc_Sort_Craftable = 'tw2gui_checkbox_checked';
                    checked = true;
                }

                TW_Calc.craft.TW_Calc_Sort_High = '';

                if ($('#TW_Calc_Sort_High').hasClass('tw2gui_checkbox_checked'))
                {
                    input = input.concat(TW_Calc.craft.difficulutHardList);
                    TW_Calc.craft.TW_Calc_Sort_High = 'tw2gui_checkbox_checked';
                    checked = true;
                }

                TW_Calc.craft.TW_Calc_Sort_Easy = '';

                if ($('#TW_Calc_Sort_Easy').hasClass('tw2gui_checkbox_checked'))
                {

                    input = input.concat(TW_Calc.craft.difficulutEasyList);
                    TW_Calc.craft.TW_Calc_Sort_Easy = 'tw2gui_checkbox_checked';
                    checked = true;

                }

                TW_Calc.craft.TW_Calc_Sort_Middle = '';

                if ($('#TW_Calc_Sort_Middle').hasClass('tw2gui_checkbox_checked'))
                {

                    input = input.concat(TW_Calc.craft.difficulutMiddleList);
                    TW_Calc.craft.TW_Calc_Sort_Middle = 'tw2gui_checkbox_checked';
                    checked = true;

                }

                if (checked === false) input = TW_Calc.craft.professionsCache[id];

                TW_Calc.craft.launch(id, input);
                return input;

            };

            TW_Calc.craft.updateLastCraft = function ()
            {

                $.get("game.php", { window: "crafting" }, function (d)
                {

                    TW_Calc.craft.dataLastCraft = {};
                    var k = d.recipes_content;

                    if (TW_Calc.bool(k) !== false)
                    {

                        for (var i = 0; i < k.length; i++)
                        {

                            var m = k[i];
                            TW_Calc.craft.dataLastCraft[m.item_id] = m.last_craft;

                        }

                    }

                });

            };

            TW_Calc.buttonLogic = function (event)
            {

                var butObj = event.data.obj;

                if ($(event.currentTarget).hasClass('butPlus'))
                {

                    if (butObj.current_value + 1 > butObj.max_value) return false;
                    butObj.current_value += 1;

                }
                else
                {

                    if (butObj.current_value - 1 < butObj.min_value) return false;
                    butObj.current_value -= 1;

                }

                $('#' + butObj.id + ' span.displayValue').text(butObj.current_value);

                return true;

            };

            TW_Calc.wheelLogic = function (ev, delta, button)
            {
                var newVal = 0,
                    change = delta > 0 ? 1 : -1;
                if (change == -1)
                {
                    newVal = button.current_value - 1;
                    if (button.min_value > newVal)
                    {
                        return false;
                    }
                }
                else
                {
                    newVal = button.current_value + 1;
                    if (button.max_value < newVal)
                    {
                        return false;
                    }
                }
                button.current_value = newVal;
                $('#' + button.id + ' span.displayValue').text(button.current_value);
                return true;
            };

            TW_Calc.craft.launch = function (id, input)
            {
                try
                {

                    if (TW_Calc.craft.dataLastCraft == undefined) TW_Calc.craft.dataLastCraft = {};

                    TW_Calc.craft.updateLastCraft();
                    TW_Calc.craft.craft = [
                        [],
                        [],
                        [],
                        []
                    ];

                    var u = "craft" + id;
                    var i = 0;
                    var de = ".TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_" + u + " > #craft_content";

                    $(de).html('');

                    var progressbar = new west.gui.Progressbar().setValue(Character.professionSkill).setMaxValue(700);
                    TW_Calc.craft.progressbar = progressbar;

                    var h = 325;

                    var myProfession = (Character.professionId == (id + 1) ? true : false);

                    if (myProfession)
                    {

                        $(de).append(new west.gui.Groupframe().setId("TWCalc_craft_progressbar").appendToContentPane(progressbar.getMainDiv()).getMainDiv());
                        h = 280;

                    }

                    if (input instanceof Array || typeof (input) == "object")
                    {

                        TW_Calc.craft.craft[id] = input;
                        TW_Calc.craft.input = input;

                    }
                    else
                    {

                        TW_Calc.craft.craft[id] = TW_Calc.craft.professionsCache[id];
                        TW_Calc.craft.input = null;
                        TW_Calc.craft.TW_Calc_Sort_Craftable = '';
                        TW_Calc.craft.TW_Calc_Sort_Name = '';

                    }

                    var allR = (input instanceof Array || typeof (input) == "object" ? false : true);

                    if (allR)
                    {
                        TW_Calc.craft.nameList = {};
                        TW_Calc.craft.difficulutMiddleList = [];
                        TW_Calc.craft.difficulutEasyList = [];
                        TW_Calc.craft.difficulutHardList = [];
                        TW_Calc.craft.craftableList = [];
                        TW_Calc.craft.nameListArray = [];
                    }

                    var scrollpane = new west.gui.Scrollpane();
                    TW_Calc.craft.scrollpane = scrollpane;

                    var ContentDiv = new west.gui.Groupframe().setId("TWCalc_craft_content").appendToContentPane(scrollpane.getMainDiv()).getMainDiv();
                    $(de).append(ContentDiv);

                    $("#TWCalc_craft_content>.tw2gui_groupframe_content_pane").css({ "height": h, "text-align": "center" });

                    var selector = ".TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_" + u + " > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane > div > .tw2gui_scrollpane_clipper > div";

                    $(selector).append('<div id="recipe_title_" onclick="TW_Calc.craft.toggleReciepes(&quot;' + u + '&quot;)" class="recipe_title" style="display:inline-block;text-align:left;"><div class="recipe_title_inner"><div id="recipe_collapse_all" class="recipe_collapse">+' + '</div><div id="recipe_difficult_" class="recipe_difficult"></div><div id="recipe_name" class="recipe_name">' + TW_Calc.getTranslation(178) + '</div></div></div>');

                    while (TW_Calc.bool(TW_Calc.craft.craft[id][i]) !== false)
                    {

                        var craft = TW_Calc.craft.craft[id][i];
                        var reciepeId = Number(craft.r);
                        var reciepe = ItemManager.get(reciepeId);
                        var productId = ItemManager.get(craft.r).craftitem;

                        if (reciepe != undefined)
                        {

                            var reciepeName = reciepe.name;
                            var craftable = true;
                            var reciepeColor = '';
                            var learnedRecipe = '';

                            if (reciepe.min_level <= Character.professionSkill)
                            {
                                reciepeColor = (Character.professionId == (id + 1) ? Crafting.getRecipeColor(ItemManager.get(reciepeId)) : '');
                            }

                            if (TW_Calc.craft.professionsCache[5].indexOf(reciepeId) == -1)
                            {
                                learnedRecipe = 'color:grey;';
                            }

                            var craftText = (TW_Calc.craft.dataLastCraft[reciepeId] == null ? TW_Calc.getTranslation(177) : '<span style="color:yellow; cursor:default;">' + TW_Calc.craft.dataLastCraft[reciepeId].formatDurationBuffWay() + '</span>');

                            var selector = ".TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_" + u + " > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane > div > .tw2gui_scrollpane_clipper > div";

                            $(selector).append('<div id="recipe_title_' + productId + '" class="recipe_title" style="display:inline-block;text-align:left;"><div class="recipe_title_inner" onclick="$(&quot;#TW_CALC_recipe_content_' + productId + '&quot;).slideToggle();if($(recipe_collapse_' + craft.r + ').html()==&quot;+&quot;){$(recipe_collapse_' + craft.r + ').html(&quot;-&quot;)}else{$(recipe_collapse_' + craft.r + ').html(&quot;+&quot;)}"><div id="recipe_collapse_' + craft.r + '" class="recipe_collapse">+' +
                                '</div><div id="recipe_difficult_' + craft.r + '" class="recipe_difficult ' + reciepeColor + '" title=""></div><div id="recipe_name_' + craft.r + '" class="recipe_name" style="width:250px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;' + learnedRecipe + '" title=\'' + reciepeName + '\'>' + reciepeName.split(':').pop() + '</div><div id="recipe_colors_' + craft.r + '" class="recipe_colors" style="margin-top:2px;color:white;">|&nbsp;<span style="color:rgb(196, 163, 103">' + reciepe.min_level + '</span>/<span style="color:rgb(88, 185, 88)">' + craft.o[1] + '</span>/<span style="color:#55CDDD">' + reciepe.max_level + '</span></div></div><div class="recipe_craft_amount"></div><div id="recipe_craft_' + craft.r + '" class="recipe_craft" style="color:white">' + (Character.professionId == (id + 1) ? craftText : '') + '</div></div><div id="TW_CALC_recipe_content_' + productId + '" class="recipe_content" style="margin-left:auto;margin-right:auto;display:none"><div id="recipe_craftitem_' + craft.r + '" class="recipe_craftitem"></div><div id="recipe_resources_content_' + craft.r + '" class="recipe_resources"></div></div></div>');

                            var craft_recipe_data = { "inventory": {}, "required": {} };

                            if (Boolean(ItemManager.get(reciepeId).resources) !== false)
                            {

                                var _craft = TW_Calc.craft.ItemCraft;

                                var s = selector + '>#TW_CALC_recipe_content_' + productId + '>#recipe_resources_content_' + craft.r,
                                    d;

                                for (var j = 0; j < ItemManager.get(reciepeId).resources.length; j++)
                                {
                                    d = _craft(j, s, reciepeId, craftable);
                                    craftable = d.craftable;
                                    craft_recipe_data.inventory = TW_Calc.functions.extend(craft_recipe_data.inventory, d.craft_recipe_data.inventory);
                                    craft_recipe_data.required = TW_Calc.functions.extend(craft_recipe_data.required, d.craft_recipe_data.required);
                                }

                            }

                            var calc_amount = {};
                            var amount_data = [];

                            for (var k in craft_recipe_data.inventory)
                            {

                                calc_amount.id = k;
                                calc_amount.inventory = craft_recipe_data.inventory[k];
                                calc_amount.required = craft_recipe_data.required[k];
                                calc_amount.craftable = Math.floor(calc_amount.inventory / calc_amount.required);
                                amount_data.push(calc_amount.craftable);
                            }

                            var maxCraftable = Array.min(amount_data);
                            var amount = new west.gui.Plusminusfield('recipe_button_' + craft.r, 1, 1, maxCraftable, 1, TW_Calc.buttonLogic, TW_Calc.buttonLogic, TW_Calc.wheelLogic);

                            if (myProfession)
                            {

                                $('#recipe_title_' + productId, selector).find(".recipe_craft_amount").append(amount.getMainDiv());

                            }

                            $("#recipe_craft_" + craft.r).attr("item_id", craft.r).click(function ()
                            {
                                var id = $(this).attr("item_id");
                                TW_Calc.craft.startCraft(id);
                                TW_Calc.craft.reload();
                            });

                            if (reciepe.min_level > Character.professionSkill)
                            {
                                $("#recipe_craft_" + craft.r).empty();
                                $("#recipe_craft_" + craft.r).unbind('click');
                                $('#recipe_title_' + productId + ">.recipe_craft_amount", selector).empty();
                            }
                            else if (craftable === false || TW_Calc.craft.professionsCache[5].indexOf(reciepeId) == -1)
                            {
                                $("#recipe_craft_" + craft.r).empty();
                                $("#recipe_craft_" + craft.r).unbind('click');
                                $('#recipe_title_' + productId + ">.recipe_craft_amount", selector).empty();
                            }

                            if (craftable === true && reciepe.min_level <= Character.professionSkill && TW_Calc.craft.professionsCache[5].indexOf(reciepeId) > -1 && allR === true) TW_Calc.craft.craftableList.push(craft);

                            if (reciepeColor == 'easy' && allR === true) TW_Calc.craft.difficulutEasyList.push(craft);

                            if (reciepeColor == 'middle' && allR === true) TW_Calc.craft.difficulutMiddleList.push(craft);

                            if (reciepeColor == 'hard' && allR === true) TW_Calc.craft.difficulutHardList.push(craft);

                            if (allR === true)
                            {
                                TW_Calc.craft.nameList[reciepeName.toLowerCase()] = craft;
                                TW_Calc.craft.nameListArray.push(reciepeName.toLowerCase());
                            }


                            var productDiv = new tw2widget.CraftingItem(ItemManager.get(productId)).setCount(Bag.getItemCount(productId)).getMainDiv();

                            $(selector + '>#TW_CALC_recipe_content_' + productId + '>#recipe_craftitem_' + craft.r).append(productDiv);
                            $(selector + '>#TW_CALC_recipe_content_' + productId + '>#recipe_craftitem_' + craft.r).attr("item_id", productId);

                        }
                        else
                        {

                            new TW_Calc.Error({ message: 'RECIPE DOES NOT EXIST; ID:' + reciepeId }, 'craft.launch').show();

                        }

                        i++;
                    }

                    if (myProfession)
                    {

                        $('.TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_' + u + ' > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane > .tw2gui_scrollpane').css("width", 590);

                        var rightPanel = $('.TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_' + u + ' > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane');
                        rightPanel.append('<div class="TW_Calc_rightPanel" style="position:absolute;top:15px;right:15px;width:65px;text-align:center"></div>');

                        var rightPanelContent = $('.TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_' + u + ' > #craft_content > #TWCalc_craft_content.tw2gui_groupframe > .tw2gui_groupframe_content_pane > .TW_Calc_rightPanel');

                        rightPanelContent.append(new west.gui.Textfield().setWidth(50).setPlaceholder('Search...').setId('TW_Calc_Sort_Name').getMainDiv().on('input', TW_Calc.craft.sortName));

                        rightPanelContent.append(new west.gui.Checkbox().setCallback(TW_Calc.craft.sort).setTooltip(TW_Calc.getTranslation(176)).setId('TW_Calc_Sort_Craftable').getMainDiv().addClass(TW_Calc.craft.TW_Calc_Sort_Craftable)).append('</br>');

                        rightPanelContent.append(new west.gui.Checkbox().setCallback(TW_Calc.craft.sort).setTooltip('<div class="recipe_difficult easy" style="margin:0px;padding:0;float:left"></div>').setId('TW_Calc_Sort_Easy').getMainDiv().addClass(TW_Calc.craft.TW_Calc_Sort_Easy)).append('</br>');

                        rightPanelContent.append(new west.gui.Checkbox().setCallback(TW_Calc.craft.sort).setTooltip('<div class="recipe_difficult middle" style="margin:0px;padding:0;float:left"></div>').setId('TW_Calc_Sort_Middle').getMainDiv().addClass(TW_Calc.craft.TW_Calc_Sort_Middle)).append('</br>');

                        rightPanelContent.append(new west.gui.Checkbox().setCallback(TW_Calc.craft.sort).setTooltip('<div class="recipe_difficult hard" style="margin:0px;padding:0;float:left"></div>').setId('TW_Calc_Sort_High').getMainDiv().addClass(TW_Calc.craft.TW_Calc_Sort_High)).append('</br>');

                        rightPanelContent.append($('<a href="javascript:TW_Calc.craft.openMyProffesion()">Reload</a>'));

                    }

                    wman.getById("TW-CALC-QUEST").setTitle(TW_Calc.getTranslation(183) + ' - ' + TW_Calc.getTranslation(179 + id));

                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'craft.launch').show();

                }
            };

            TW_Calc.craft.show = function (id)
            {
                try
                {
                    TW_Calc.quest.window.launch();
                    var profId = Math.floor(TW_Calc.craft.professionsCache[4].indexOf(id) / 35);
                    TW_Calc.quest.window.showTab('craft' + profId, function ()
                    {
                        TW_Calc.craft.launch(profId);
                    });
                    $('#TW_CALC_recipe_content_' + id).slideDown();
                    setTimeout(function ()
                    {
                        var y = (TW_Calc.craft.scrollpane.clipPane[0].clientHeight - 30) / TW_Calc.craft.scrollpane.contentPane[0].clientHeight * $('#recipe_title_' + id)[0].offsetTop;
                        TW_Calc.craft.scrollpane.scrollTo(0, y, true);
                    }, 500);
                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'craft.show').show();

                }
            };

            TW_Calc.craft.questEmployer = function (nr)
            {
                try
                {

                    Ajax.get('map', 'get_minimap', {}, function (json)
                    {
                        if (json.error)
                            return new UserMessage(json.msg).show();
                        var tmpObj = json.quest_locations[nr];
                        if (isDefined(tmpObj))
                            Map.center(tmpObj[0][0], tmpObj[0][1]);
                        else
                            new UserMessage(TW_Calc.getTranslation(204), 'hint').show();
                    });

                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'craft.questEmployer').show();

                }
            };

            TW_Calc.craft.quests = function ()
            {
                try
                {

                    Quest.calc_getMinimapLink = Quest.getMinimapLink;
                    Quest.getMinimapLink = function (jsRequirement)
                    {
                        var mmLink = '',
                            tmpObj = null;
                        if (jsRequirement && jsRequirement.id && jsRequirement.type == 'inventory_changed')
                        {
                            tmpObj = ItemManager.get(jsRequirement.id);
                            if (isDefined(tmpObj) && tmpObj.spec_type == 'crafting')
                            {
                                mmLink = '<span class="quest_craftlink" style="cursor:pointer;" title=\'' + TW_Calc.getTranslation(192) + '\' onclick="TW_Calc.craft.show(' + tmpObj.item_id + ')"><img src="/images/items/yield/toolbox.png" width="16"/></span>&nbsp;';
                                return mmLink;
                            }
                        }
                        else if (jsRequirement && jsRequirement.type == 'task-finish-walk')
                        {
                            mmLink = '<span class="quest_employerlink" style="cursor:pointer;" title=\'' + TW_Calc.getTranslation(205) + '\' onclick="TW_Calc.craft.questEmployer(' + jsRequirement.value + ')"><img src="/images/map/minimap/icons/miniicon_quests.png"/></span>&nbsp;';
                            return mmLink;
                        }
                        return Quest.calc_getMinimapLink(jsRequirement);
                    };

                    Quest.calc_render = Quest.render;
                    Quest.render = function ()
                    {
                        Quest.calc_render.apply(this, arguments);
                        this.el.find('.quest_description_container .strong').append('<a class="quest_calclink" style="float:right;" title="' +  TW_Calc.getTranslation(206) + '" href="' + TW_Calc.website + '/quests/quest/' + this.id + '" target="_blank"><img src="/images/items/yield/book_plain.png" width="22"/></a>');
                    };
                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'craft.quests').show();

                }
            };

            Array.min = function (array)
            {
                return Math.min.apply(Math, array);
            };

            TW_Calc.quest = {};

            TW_Calc.quest.window = {};

            TW_Calc.quest.window.showTab = function (id, callback)
            {

                try
                {

                    if ($(".TW-CALC-QUEST > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > ._tab_id_" + id).hasClass("tw2gui_window_tab_active") !== true)
                    {

                        $(".TW-CALC-QUEST > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > *").each(function ()
                        {
                            $(this).removeClass("tw2gui_window_tab_active");
                        });
                        $(".TW-CALC-QUEST > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > ._tab_id_" + id).addClass("tw2gui_window_tab_active");
                        $(".TW-CALC-QUEST > div.tw2gui_window_content_pane > *").each(function ()
                        {
                            $(this).hide();
                        });
                        $(".TW-CALC-QUEST > div.tw2gui_window_content_pane > #tab_" + id).fadeIn();
                    }

                    callback();

                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'quest.window.showTab').show();

                }

            };

            TW_Calc.quest.window.launch = function ()
            {

                try
                {

                    var id = "TW-CALC-QUEST";
                    var tab = TW_Calc.getTranslation(183);

                    var tabclick = function (win, id)
                    {
                        TW_Calc.quest.window.showTab(id, function ()
                        {

                            TW_Calc.craft.launch(Number(id.toString()[5]));

                        });
                    };

                    var html = '<div id="craft_content" style="position:absolute;width:685px;height:98%;top:10px;left:7px;"></div>';

                    wman.open(id).setTitle(tab).setMiniTitle("TW-Calc " + tab).addTab(TW_Calc.getTranslation(179), "craft0", tabclick).addTab(TW_Calc.getTranslation(180), "craft1", tabclick).addTab(TW_Calc.getTranslation(181), "craft2", tabclick).addTab(TW_Calc.getTranslation(182), "craft3", tabclick).appendToContentPane($('<div id="tab_craft0">' + html + '</div><div id="tab_craft1" style="display:none">' + html + '</div><div id="tab_craft2" style="display:none">' + html + '</div><div id="tab_craft3" style="display:none">' + html + '</div>'));

                    TW_Calc.quest.window.showTab("craft1", function () {});

                    $(".tw2gui_window.tw2gui_win2.TW-CALC-QUEST").addClass("noreload");

                }
                catch (e)
                {

                    new TW_Calc.Error(e, 'quest.window.launch').show();

                }
            };

            OnGoingWestcalcErrorEntry = function (f)
            {

                this.init("", f);
                this.setTooltip("Westcalc error");
                this.setImageClass("hint");

            };

            OnGoingWestcalcErrorEntry.prototype = new OnGoingEntry();

            TW_Calc.Error = function (error, d)
            {
                this.e = error;
                this.d = d;
                this.show = function ()
                {
                    var that = this;
                    TW_Calc.ErrorLog.add(that.e.message, that.d);
                    WestUi.NotiBar.add(new OnGoingWestcalcErrorEntry(function ()
                    {
                        wman.open("TW-Calc-Error").appendToContentPane(that.e.message + '</br>' + that.d).setTitle("TW-Calc Error").setMiniTitle("TW-Calc Error").setSize(400, 300);
                    }, "TW Calc Error accoured", "hint"));
                    console.log('TW-Calc Error:' + that.e.message + ' - ' + that.d);
                };
            };

            TW_Calc.ErrorLog = {};

            TW_Calc.ErrorLog.sendError = function (errorCode)
            {
                if (TW_Calc.Settings.get("sendErrors") && !TW_Calc.ShowLogs)
                {
                    $.get(TW_Calc.website + "/service/send-error", { errorCode: errorCode, name: Character.name, id: Character.playerId, server: Game.gameURL, locale: Game.locale, WestcalcVersion: TW_Calc.version, GameVersion: Game.version }, function (data) {}, "jsonp");
                }
            };

            TW_Calc.ErrorLog.create = function ()
            {
                TW_Calc.ErrorLog.log = [];
            };

            TW_Calc.ErrorLog.add = function (e, d)
            {
                TW_Calc.ErrorLog.sendError(e + ' | ' + d);
                TW_Calc.ErrorLog.log.push([e, d]);
            };

            TW_Calc.ErrorLog.open = function ()
            {

                var c = '';
                var k = 0;

                while (TW_Calc.ErrorLog.log[k])
                {
                    c += TW_Calc.ErrorLog.log[k][0] + ' | ' + TW_Calc.ErrorLog.log[k][1] + '\n';
                    k++;
                }

                wman.open("TW-Calc Errorlog").appendToContentPane(new west.gui.Textarea().setReadonly().setContent(c).setWidth(675).setHeight(355).getMainDiv()).setTitle("TW-Calc Errorlog").setMiniTitle("TW-Calc Errorlog");
            };

            TW_Calc.ErrorLog.create();


            TW_Calc.nearestJob = {};

            TW_Calc.nearestJob.selector = '#Westcalc_bottomBar';

            TW_Calc.nearestJob.MainDiv = '';

            TW_Calc.nearestJob.list = [];

            TW_Calc.nearestJob.map = null;

            TW_Calc.nearestJob.getMap = function ()
            {

                Ajax.get("map", "get_minimap", {}, function (q)
                {
                    TW_Calc.nearestJob.map = q;
                });

            };

            TW_Calc.nearestJob.lastPos = function ()
            {

                var e = Character.position.x;
                var t = Character.position.y;
                var n = TaskQueue.queue;

                for (var r = 0; r < n.length; r++)
                {

                    var i = n[r].wayData;

                    if (i.x)
                    {
                        e = i.x;
                        t = i.y;
                    }
                }

                return [e, t];
            };

            TW_Calc.nearestJob.find = function (e, dataType)
            {

                TW_Calc.nearestJob.j = e;

                if (TW_Calc.nearestJob.map != null) var q = TW_Calc.nearestJob.map;
                else TW_Calc.nearestJob.getMap();

                if (TW_Calc.bool(q) === false) new UserMessage(TW_Calc.getTranslation(143), "success").show();

                var u = q.job_groups;
                e = Number(TW_Calc.nearestJob.j);
                var t = TW_Calc.nearestJob;
                var n = JobList.getJobById(e);
                var r = u[n.groupid];

                if (!r) return [];

                var i = [];

                var s = t.lastPos();

                for (var o = 0; o < r.length; o++)
                {

                    var a = r[o][0] - s[0];
                    var f = r[o][1] - s[1];
                    var l = Math.sqrt(a * a + f * f);
                    i.push({ dist: l, x: r[o][0], y: r[o][1] });
                }

                var p = function (e, t)
                {
                    return e.dist * 1 > t.dist * 1 ? 1 : -1;
                };

                i.sort(p);

                var job = i[0];

                switch (dataType.type)
                {

                    case "startJob":
                        TaskQueue.add(new TaskJob(e, Number(job.x), Number(job.y), dataType.duration));
                        break;

                    default:
                        JobWindow.open(e, Number(job.x), Number(job.y));
                }
            };

            TW_Calc.nearestJob.search = function (id)
            {
                TW_Calc.nearestJob.find(id, { type: "window" });
            };

            TW_Calc.nearestJob.save = function (div)
            {

                var data = [];
                if (TW_Calc.bool(localStorage.getItem("TWCalc_jobList")) !== false) data = localStorage.getItem("TWCalc_jobList").split(",");

                var l = data.length;
                var id = div.attr("job_id");
                var opacity = div.css("opacity");

                if (opacity == 1)
                {

                    var n = data.indexOf(id);
                    data.splice(n, 1);

                }
                else
                {

                    if (data.indexOf(id) == -1) data[l] = id;

                }

                var val = '';
                if (data != '') val = data.join();

                localStorage.setItem("TWCalc_jobList", val);

                TW_Calc.nearestJob.build();
                TW_Calc.nearestJob.fade(div);
                TW_Calc.nearestJob.loadBottomBar();
            };

            TW_Calc.nearestJob.build = function ()
            {

                if (TW_Calc.bool(localStorage.getItem("TWCalc_jobList")) !== false)
                {

                    if (localStorage.getItem("TWCalc_jobList") != '') TW_Calc.nearestJob.list = localStorage.getItem("TWCalc_jobList").split(",");
                    else TW_Calc.nearestJob.list = [];

                }
                else
                {
                    TW_Calc.nearestJob.list = [];
                }
            };

            TW_Calc.nearestJob.fade = function (s)
            {

                if (s.css("opacity") == 1) s.css("opacity", 0.5);
                else s.css("opacity", 1);

            };

            TW_Calc.nearestJob.searchInWindow = function (name)
            {
                var selector = $("#twcalc_nearjob_dialog");

                selector.empty();

                var i = 0;
                var d = new west.gui.Scrollpane();

                while (TW_Calc.bool(JobList.getSortedJobs("id")[i]) !== false)
                {

                    var job = JobList.getSortedJobs("id")[i];

                    if (job.name.toLowerCase().search(name.toLowerCase()) != -1)
                    {

                        var jobicon = '<div class="job twcalc_job" style="opacity:' + (TW_Calc.nearestJob.list.indexOf(job.id) != -1 ? '1' : '0.5') + ';position:relative!important;display:inline-block!important" title="' + job.name + '" job_id="' + job.id + '" onclick="TW_Calc.nearestJob.save($(this));"><div class="featured"></div>' + '<img src="' + TW_Calc.imgUrl + '/images/jobs/' + job.shortname + '.png" class="job_icon" /></div>';

                        d.appendContent(jobicon);
                    }

                    i++;

                }

                selector.append(d.getMainDiv());
            };

            TW_Calc.escapeHTML = function escapeHtml(text)
            {
                return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            };

            TW_Calc.nearestJob.open = function (index)
            {

                var html = '<div id="twcalc_nearjob_dialog" style="width:615px;height:325px"></div><div id="twcalc_nearjob_dialog_search_div" style="width:615px;"></div>';

                new west.gui.Dialog(TW_Calc.getTranslation(152), html).addButton(TW_Calc.getTranslation(149), function ()
                {

                    new west.gui.Dialog(TW_Calc.getTranslation(148), TW_Calc.getTranslation(146)).addButton(TW_Calc.getTranslation(149), function ()
                    {
                        localStorage.setItem('TWCalc_jobList', '');
                        TW_Calc.nearestJob.build();
                        TW_Calc.nearestJob.loadBottomBar();
                    }).addButton(TW_Calc.getTranslation(92), function () {}).show();

                }).addButton(TW_Calc.getTranslation(147), function () {}).show();

                var selector = $("#twcalc_nearjob_dialog");

                var i = 0;
                var d = new west.gui.Scrollpane();

                while (TW_Calc.bool(JobList.getSortedJobs("id")[i]) !== false)
                {

                    var job = JobList.getSortedJobs("id")[i];

                    var jobicon = '<div class="job twcalc_job" style="opacity:' + (TW_Calc.nearestJob.list.indexOf(job.id.toString()) != -1 ? '1' : '0.5') + ';position:relative!important;display:inline-block!important" title="' + TW_Calc.escapeHTML(TW_Calc.nearestJob.jobPopup(job.id)) + '" job_id="' + job.id + '" onclick="TW_Calc.nearestJob.save($(this));">' + '<img src="/images/jobs/' + job.shortname + '.png" class="job_icon" /></div>';

                    d.appendContent(jobicon);
                    i++;
                }

                selector.append(d.getMainDiv());

                $('#twcalc_nearjob_dialog_search_div').append(new west.gui.Textfield().setId('twcalc_nearjob_dialog_search').setWidth(600).setPlaceholder(TW_Calc.getTranslation(151)).getMainDiv());

                $('#twcalc_nearjob_dialog_search').keyup(function ()
                {
                    TW_Calc.nearestJob.searchInWindow($(this).val());
                });
            };

            TW_Calc.nearestJob.jobPopup = function (el)
            {

                if (ItemManager.isLoaded() === true)
                {

                    TW_Calc.nearestJob.bottomBarPopups = true;
                    return Map.PopupHandler.getJobPopup(JobList.getJobById(el));

                }
                else
                {

                    return JobList.getJobById(el).name;

                }

            };

            try
            {

                TW_Calc.nearestJob.build();

            }
            catch (e)
            {

                new TW_Calc.Error(e).show();

            }

            TW_Calc.nearestJob.start = function (jobid, duration)
            {

                TW_Calc.nearestJob.find(jobid, { type: "startJob", duration: duration });

            };

            TW_Calc.nearestJob.posY = 97;

            TW_Calc.nearestJob.JobBarEnabled = (TW_Calc.Settings.get("topBar", "number") == 1) || (TW_Calc.Settings.get("topBar", "number") == 2);

            TW_Calc.nearestJob.loadBottomBar = function ()
            {

                if (TW_Calc.nearestJob.JobBarEnabled)
                {

                    TW_Calc.nearestJob.bottomBar = new west.gui.Scrollpane();
                    TW_Calc.nearestJob.bottomBar.verticalBar.hide();

                    $("#Westcalc_JobBar").remove();

                    if (TW_Calc.Settings.get("topBar", "number") == 1)
                    {

                        $(TW_Calc.nearestJob.MainDiv).append('<div id="Westcalc_JobBar" style="overflow:hidden;width:510px;height:61px;margin-left:auto;margin-right:auto;text-align:left"></div>');

                    }
                    else if (TW_Calc.Settings.get("topBar", "number") == 2)
                    {

                        $(TW_Calc.nearestJob.MainDiv).append('<div id="Westcalc_JobBar" style="overflow:hidden;width:510px;height:61px;margin-left:auto;margin-right:auto;text-align:left"></div>');

                    }

                    var i = 0;

                    var bottomBar = $('#Westcalc_JobBar');

                    data = TW_Calc.nearestJob.list;

                    var selector = TW_Calc.nearestJob.bottomBar;

                    while (TW_Calc.bool(data[i]) !== false)
                    {

                        var job = JobList.getJobById(data[i]);
                        var html = '<div class="instantwork-short" title="15s - ' + job.name + '" onclick="TW_Calc.nearestJob.start($($(this).parent()).attr(&quot;job_id&quot;),15);"></div><div class="instantwork-middle" title="10m - ' + job.name + '" onclick="TW_Calc.nearestJob.start($($(this).parent()).attr(&quot;job_id&quot;),600);"></div><div class="instantwork-long" title="1h - ' + job.name + '" onclick="TW_Calc.nearestJob.start($($(this).parent()).attr(&quot;job_id&quot;),3600);"></div>';

                        selector.appendContent('<div class="job twcalc_job" style="position:relative!important;display:inline-block!important;margin-top:5px;margin-bottom:2px;" job_id="' + job.id + '"><div class="featured" title="' + TW_Calc.escapeHTML(TW_Calc.nearestJob.jobPopup(job.id)) + '" onclick="TW_Calc.nearestJob.search($($(this).parent()).attr(&quot;job_id&quot;));"></div>' + (Premium.hasBonus("automation") === true ? html : '') + '<img src="' + TW_Calc.imgUrl + '/images/jobs/' + job.shortname + '.png" class="job_icon" /></div>');
                        i++;

                    }

                    selector.appendContent('<div class="job twcalc_job" style="position:relative!important;display:inline-block!important;margin-top:5px;margin-bottom:2px" title="' + TW_Calc.getTranslation(150) + '" onclick="TW_Calc.nearestJob.open()"><div class="featured"></div>' + '<img src="data:image/png;data:;base64,' + TW_Calc.bottomImg + '" class="job_icon" /></div>');

                    bottomBar.append(TW_Calc.nearestJob.bottomBar.getMainDiv());
                }

                if (ItemManager.isLoaded() === true)
                {
                    TW_Calc.nearestJob.bottomBarPopups = true;
                }
            };

            TW_Calc.nearestJob.loadedPopups = function ()
            {

                if (TW_Calc.nearestJob.bottomBarPopups === false || TW_Calc.nearestJob.bottomBarPopups == undefined)
                {

                    TW_Calc.nearestJob.loadBottomBar();

                    setTimeout(TW_Calc.nearestJob.loadedPopups, 1000);

                }
                else
                {

                    TW_Calc.nearestJob.bottomBarPopups = true;

                }
            };

            TW_Calc.nearestJob.inject = function ()
            {

                if (TW_Calc.nearestJob.JobBarEnabled)
                {

                    TW_Calc.nearestJob.loadBottomBar();
                    TW_Calc.nearestJob.loadedPopups();

                    TW_Calc.nearestJob.getMap();

                }

            };

            TW_Calc.BottomBarMover = function ()
            {

                TW_Calc.nearestJob.intTimer = 500;

                TW_Calc.nearestJob.int = setInterval(function ()
                {

                    if ((TW_Calc.Settings.get("topBar", "number") == 1) || (TW_Calc.Settings.get("duelBar", "number") == 2))
                    {

                        var n = $("div#ui_bottombar").height() + 5 + (Game.version <= 2.06 ? 0 : 14) + ($(".friendsbar").height() > 0 ? $(".friendsbar").height() : 0);

                        if ($("#ui_windowdock").css("display") == "none" || $('.windowbar_frames').html() == '') n = n + 15;
                        else n = n + 47;

                        $('#WESTCALC_BOTTOM_BAR').stop();
                        TW_Calc.nearestJob.posY = n;
                        $('#WESTCALC_BOTTOM_BAR').animate({ "bottom": n }, TW_Calc.nearestJob.intTimer);

                    }

                }, TW_Calc.nearestJob.intTimer);


            };

            TW_Calc.Wardrobe = {};
            TW_Calc.Wardrobe.id = 'TW_Calc_Wardrobe';
            TW_Calc.Wardrobe.img = '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';

            TW_Calc.Wardrobe.bannedLocales = TW_Calc.Wardrobe_bannedLocales;

            TW_Calc.Wardrobe.window = {};

            $('#TW_Calc_Wardrobe').click(function ()
            {

                TW_Calc.Wardrobe.window.launch();

            });

            TW_Calc.Wardrobe.window.launch = function ()
            {

                if (typeof (wman.getById('wear')) == "undefined")
                {

                    Wear.open();

                }
                else
                {

                    wman.getById('wear').bringToTop();

                }

                if (typeof (wman.getById('inventory')) !== undefined)
                {

                    wman.getById('inventory').destroy();

                }

                TW_Calc.Wardrobe.window.open();

                if (TW_Calc.Wardrobe.Wardrobe.getAll().length !== 0)
                {

                    TW_Calc.Wardrobe.Wardrobe.show(0);

                }
            };

            TW_Calc.Wardrobe.window.getPos = function (k)
            {

                var win = $('.tw2gui_window.tw2gui_win2.tw2gui_window_notabs.wear');
                var l = Number(win.css("left").split('px')[0]);
                var t = Number(win.css("top").split('px')[0]);
                var w = Number(win.css("width").split('px')[0]);
                var s = l + w;
                var m = t;
                obj = { x: s, y: m };
                return obj[k];

            };

            TW_Calc.Wardrobe.window.moveTo = function (x, y)
            {
                $('.tw2gui_window.tw2gui_win2.' + TW_Calc.Wardrobe.id).css('left', TW_Calc.Wardrobe.window.getPos('x')).css('top', TW_Calc.Wardrobe.window.getPos('y'));
            };

            TW_Calc.Wardrobe.alert = function ()
            {

                if (TW_Calc.Wardrobe.bannedLocales.indexOf(Game.locale) != -1)
                {

                    if (localStorage.getItem("TWCalc_Wardrobe_Status") === null)
                    {

                        new west.gui.Dialog().setText("TW-Calc Wardrobe is disabled because is not allowed by your game admin in your game locale.").setTitle("TW-Calc Wardrobe is disabled").show().addButton("ok");

                        localStorage.setItem("TWCalc_Wardrobe_Status", "true");

                    }


                }

            };

            TW_Calc.Wardrobe.window.open = function ()
            {

                var win = wman.open(TW_Calc.Wardrobe.id);

                win.setTitle(TW_Calc.Wardrobe.lang[0]).setMiniTitle(TW_Calc.Wardrobe.lang[0]).setSize(328, 383);

                var tabclick = function (win, id)
                {

                    TW_Calc.Wardrobe.window.showTab(id);

                    if (id == 'OwnCalc') TW_Calc.Wardrobe.OwnCalc.launch();

                };

                if (TW_Calc.Wardrobe.bannedLocales.indexOf(Game.locale) == -1)
                {
                    win.addTab(TW_Calc.Wardrobe.lang[0], 'wardrobe', tabclick);
                }

                win.addTab(TW_Calc.Wardrobe.lang[1], 'OwnCalc', tabclick);

                $('.tw2gui_window.tw2gui_win2.' + TW_Calc.Wardrobe.id).addClass("noreload");

                win.appendToContentPane($('<div id="wardrobe" class="TW_Calc" style="display:none;margin-top:5px;"></div><div id="OwnCalc" class="TW_Calc" style="display:none;margin-top:5px;"></div><div id="job" class="TW_Calc" style="display:none;margin-top:5px;"></div>'));

                TW_Calc.Wardrobe.window.moveTo(TW_Calc.Wardrobe.window.getPos('x'), TW_Calc.Wardrobe.window.getPos('y'));

                if (TW_Calc.Wardrobe.bannedLocales.indexOf(Game.locale) != -1)
                {
                    TW_Calc.Wardrobe.window.showTab('OwnCalc');
                    TW_Calc.Wardrobe.OwnCalc.launch();
                }
                else
                {
                    TW_Calc.Wardrobe.Wardrobe.launch();
                }

                $('#TW_Calc_Wardrobe_Head > #TW_Calc_Caption').remove();
            };

            TW_Calc.Wardrobe.Wardrobe = {};

            TW_Calc.Wardrobe.OwnCalc = {};

            TW_Calc.Wardrobe.OwnCalc.show = function (id)
            {

                $('#TW_Calc_Wardrobe_OwnCalc_del').css('display', 'inline-block');
                $('#TW_Calc_Wardrobe_OwnCalc_config').css('display', 'inline-block');
                $('#TW_Calc_OwnCalc_Items>.tw2gui_groupframe_content_pane').empty();

                var s = TW_Calc.Wardrobe.OwnCalc.get(id);

                $('#TW_Calc_Wardrobe_OwnCalc_del').unbind('click');

                $('#TW_Calc_Wardrobe_OwnCalc_del').attr('remove_id', id).click(function ()
                {
                    TW_Calc.Wardrobe.OwnCalc.remove($(this).attr('remove_id'));
                });

                $('#TW_Calc_Wardrobe_OwnCalc_config').unbind('click');

                $('#TW_Calc_Wardrobe_OwnCalc_config').attr('config_id', id).click(function ()
                {
                    TW_Calc.Wardrobe.OwnCalc.seeConfiguration($(this).attr('config_id'));
                });

                var i = 0;

                var name = s.name.toString();
                if (name == '') name = 'Unnamed';
                delete s.name;

                TW_Calc.Wardrobe.OwnCalc.actualWear = s;

                if (Bag.loaded)
                {
                    var items = west.item.Calculator.getBestSet(s).getItems();

                    for (i; i < (items.length); i++)
                    {
                        var item = new tw2widget.InventoryItem(ItemManager.get(Number(items[i])));

                        $('#TW_Calc_OwnCalc_Items>.tw2gui_groupframe_content_pane').append($(item.getMainDiv()).attr('item_id', items[i]).click(function () { TW_Calc.Wardrobe.Wardrobe.wear($(this).attr('item_id')); }));
                    }

                }
                else
                {
                    Bag.loadItems();
                }

                TW_Calc.Wardrobe.Wardrobe.fadeAll();

                $('#TW_Calc_OwnCalc_Head > .tw2gui_groupframe_content_pane > #TW_Calc_Caption').remove();
                $('#TW_Calc_OwnCalc_Head > .tw2gui_groupframe_content_pane').append('<span id="TW_Calc_Caption" style="font-weight:bold;font-size:18px;">' + name + '</span>');

                if ((Premium.hasBonus("automation") === true) || (Premium.hasBonus("automation") != true))
                {

                    $("#TW_Calc_OwnCalc_Items>.tw2gui_groupframe_content_pane").append('<center>');
                    $("#TW_Calc_OwnCalc_Items>.tw2gui_groupframe_content_pane").append(new west.gui.Button().setCaption("Wear all").click(function ()
                    {
                        TW_Calc.Wardrobe.OwnCalc.wearAll(TW_Calc.Wardrobe.OwnCalc.actualWear);
                    }).getMainDiv());

                    $("#TW_Calc_OwnCalc_Items>.tw2gui_groupframe_content_pane").append('</center>');
                }
            };

            TW_Calc.Wardrobe.OwnCalc.wearAll = function (id)
            {

                var items = west.item.Calculator.getBestSet(id).getItems();
                var i = 0;

                if (Bag.loaded)
                {

                    for (i; i < (items.length); i++)
                    {
                        TW_Calc.Wardrobe.Wardrobe.wear(items[i]);
                    }

                }
                else
                {
                    Bag.loadItems();
                }
            };

            TW_Calc.Wardrobe.OwnCalc.seeConfiguration = function (id)
            {

                var data = TW_Calc.Wardrobe.OwnCalc.get(Number(id));
                var dialog = new west.gui.Dialog((data.name == '' ? 'Unnamed' : data.name), '<div id="TW_Calc_Wardrobe_OwnCalc_Dialog_Div"></div>').setId('TW_Calc_Wardrobe_OwnCalc_Dialog');

                dialog.addButton(TW_Calc.Wardrobe.lang[3], function () {});
                dialog.show();

                $("div#TW_Calc_Wardrobe_OwnCalc_Dialog_Div").append(new west.gui.Groupframe().appendToContentPane('<div id="Skills" style="width:432px;margin-left:auto;margin-right:auto;text-align:center;"></div><div></div>').getMainDiv());

                var skills = CharacterSkills.allSkillKeys;
                var k = 0;

                for (k; k < skills.length; k++)
                {

                    $("#Skills").append(CharacterSkills.getSkill(skills[k]).getSkillPMBox("TW_Calc_Wardrobe_OwnCalc_" + skills[k], {}, { id: "TW_Calc_Wardrobe_OwnCalc_" + skills[k] + "_id", min_value: 0, start_value: data[skills[k]], max_value: data[skills[k]], extra_points: 0, callbackPlus: function () {}, callbackMinus: function () {} }));

                }

                $('#TW_Calc_Wardrobe_OwnCalc_Dialog').css('top', (($('body').height() - $('#TW_Calc_Wardrobe_OwnCalc_Dialog_Div').height()) / 2));
            };

            TW_Calc.Wardrobe.OwnCalc.launch = function ()
            {

                TW_Calc.Wardrobe.window.showTab('OwnCalc');

                var maindiv = '#OwnCalc.TW_Calc';

                var c = '<div onclick="TW_Calc.Wardrobe.OwnCalc.AddDialog()" title="' + TW_Calc.Wardrobe.lang[11] + '" style="position:absolute;right:44px;background:url(' + TW_Calc.imgUrl + '/images/tw2gui/iconset.png);width:16px;height:16px;display:inline-block;background-position: -16px 80px;cursor:pointer;"></div><div id="TW_Calc_Wardrobe_OwnCalc_del" style="background:url(' + TW_Calc.imgUrl + '/images/tw2gui/iconset.png);width:16px;height:16px;display:none;background-position: -48px 0px;cursor:pointer;position:absolute;right:62px;" title="' + TW_Calc.Wardrobe.lang[8] + '"></div><div id="TW_Calc_Wardrobe_OwnCalc_config" title="' + TW_Calc.Wardrobe.lang[12] + '" style="display:none;background:url(/images/tw2gui/iconset.png);width:16px;height:16px;display:none;background-position: -32px 80px;cursor:pointer;position:absolute;right:80px;"></div><div id="TW_Calc_OwnCalc_Selectbox" style="position: absolute;right: 14px;top: 14px;background:url(/images/window/character/title_editbtn.jpg) no-repeat;width:24px;height:18px;cursor:pointer;background-position: -2px -1px;border: 1px solid"></div>';

                $(maindiv).html(new west.gui.Groupframe().setId('TW_Calc_OwnCalc_Head').appendToContentPane(c).getMainDiv());

                $("#TW_Calc_OwnCalc_Head>.tw2gui_groupframe_content_pane").css("height", "19px");

                $('#TW_Calc_OwnCalc_Selectbox').click(function (e)
                {

                    TW_Calc.Wardrobe.OwnCalc.Selectbox = new west.gui.Selectbox().setHeader(TW_Calc.Wardrobe.lang[10]);

                    var sBox = TW_Calc.Wardrobe.OwnCalc.Selectbox;
                    var i = 0;
                    var s = TW_Calc.Wardrobe.OwnCalc.getAll();

                    for (i; i < s.length; i++)
                    {

                        var name = s[i].name;
                        if (s[i].name == '')
                        {
                            name = 'Unnamed';
                        }

                        sBox.addItem(i, name);
                    }

                    sBox.addListener(function (id)
                    {
                        TW_Calc.Wardrobe.OwnCalc.show(id);
                    });

                    TW_Calc.Wardrobe.OwnCalc.Selectbox.show(e);

                });

                $(maindiv).append(new west.gui.Groupframe().setId('TW_Calc_OwnCalc_Items').getMainDiv());

                $('#TW_Calc_OwnCalc_Items').css('height', 220);

                if (TW_Calc.Wardrobe.OwnCalc.getAll().length !== 0)
                {
                    TW_Calc.Wardrobe.OwnCalc.show(0);
                }

            };

            TW_Calc.Wardrobe.OwnCalc.remove = function (id)
            {

                var item = TW_Calc.Wardrobe.OwnCalc.getAll();
                item.splice(id, 1);
                TW_Calc.Wardrobe.OwnCalc.Save(item);

                new UserMessage(TW_Calc.Wardrobe.lang[6], UserMessage.TYPE_SUCCESS).show();

                TW_Calc.Wardrobe.OwnCalc.launch();
                TW_Calc.Wardrobe.OwnCalc.show((TW_Calc.Wardrobe.OwnCalc.getAll().length - 1));
            };

            TW_Calc.Wardrobe.OwnCalc.getAll = function ()
            {

                var data = '[]';
                if (TW_Calc.bool(localStorage.getItem('TWCalc_OwnCalc')) !== false)
                {
                    data = localStorage.getItem('TWCalc_OwnCalc');
                }

                return $.parseJSON(data);
            };

            TW_Calc.Wardrobe.OwnCalc.get = function (i)
            {

                var data = '[]';
                if (TW_Calc.bool(localStorage.getItem('TWCalc_OwnCalc')) !== false)
                {
                    data = localStorage.getItem('TWCalc_OwnCalc');
                }

                return $.parseJSON(data)[i];
            };

            TW_Calc.Wardrobe.OwnCalc.AddDialog = function ()
            {

                var dialog = new west.gui.Dialog(TW_Calc.Wardrobe.lang[11], '<div id="TW_Calc_Wardrobe_OwnCalc_Dialog_Div"></div>').setId('TW_Calc_Wardrobe_OwnCalc_Dialog');

                dialog.addButton(TW_Calc.getTranslation(36), function ()
                {
                    TW_Calc.Wardrobe.OwnCalc.Add(TW_Calc.Wardrobe.OwnCalc.createObject());
                }).addButton(TW_Calc.getTranslation(92), function () {}).show();

                $("div#TW_Calc_Wardrobe_OwnCalc_Dialog_Div").append(new west.gui.Groupframe().appendToContentPane('<div id="Skills" style="width:432px;margin-left:auto;margin-right:auto;text-align:center;"></div><div></div>').getMainDiv());

                var skills = CharacterSkills.allSkillKeys;
                var k = 0;

                var logicPlusMinus = function (event)
                {

                    var butObj = event.data.obj,
                        v;

                    if ($(event.currentTarget).hasClass('butPlus'))
                    {

                        v = $(".tw2gui_plusminus#" + butObj.id + ">.displayValue").html();
                        $(".tw2gui_plusminus#" + butObj.id + ">.displayValue").html(Number(v) + 1);

                    }

                    if ($(event.currentTarget).hasClass('butMinus'))
                    {

                        v = $(".tw2gui_plusminus#" + butObj.id + ">.displayValue").html();
                        if ((Number(v) - 1) >= 0)
                        {
                            $(".tw2gui_plusminus#" + butObj.id + ">.displayValue").html(Number(v) - 1);
                        }

                    }
                };

                for (k; k < skills.length; k++)
                {

                    $("#Skills").append(CharacterSkills.getSkill(skills[k]).getSkillPMBox("TW_Calc_Wardrobe_OwnCalc_" + skills[k], {}, { id: "TW_Calc_Wardrobe_OwnCalc_" + skills[k] + "_id", min_value: 0, start_value: 0, max_value: 1000, extra_points: 0, callbackPlus: logicPlusMinus, callbackMinus: logicPlusMinus }));

                }

                $("#TW_Calc_Wardrobe_OwnCalc_Dialog_Div").append(new west.gui.Textfield().setWidth(440).setPlaceholder(TW_Calc.getTranslation(157)).setId("TW_Calc_Wardrobe_OwnCalc_Name").getMainDiv());

                $('#TW_Calc_Wardrobe_OwnCalc_Dialog').css('top', (($('body').height() - $('#TW_Calc_Wardrobe_OwnCalc_Dialog_Div').height()) / 2));
            };

            TW_Calc.Wardrobe.OwnCalc.createObject = function ()
            {

                var skills = CharacterSkills.allSkillKeys;
                var i = 0;
                var data = {};

                for (i; i < skills.length; i++)
                {
                    var t = $("#TW_Calc_Wardrobe_OwnCalc_" + skills[i] + "_id>.displayValue").text();
                    data[skills[i]] = Number(t);
                }

                data.name = $('#TW_Calc_Wardrobe_OwnCalc_Name').val();
                return data;
            };

            TW_Calc.Wardrobe.OwnCalc.Add = function (k)
            {

                var data = TW_Calc.Wardrobe.OwnCalc.getAll();

                data.push(k);
                TW_Calc.Wardrobe.OwnCalc.Save(data);

                return data;

            };

            TW_Calc.Wardrobe.OwnCalc.Save = function (s)
            {

                var k = '[';
                var i = 0;

                for (i; i < s.length; i++)
                {

                    var l = '';
                    if (i != (s.length - 1))
                    {
                        l = ',';
                    }

                    var skills = CharacterSkills.allSkillKeys.join().split(',');
                    skills.push('name');

                    var m = 0;
                    var o = '{';

                    for (m; m < skills.length; m++)
                    {

                        var q = '';
                        if (m != (skills.length - 1))
                        {
                            q = ',';
                        }

                        o += '"' + skills[m] + '":"' + s[i][skills[m]] + '"' + q;
                    }

                    o += '}';
                    k += o + l;
                }

                k += ']';

                localStorage.setItem('TWCalc_OwnCalc', k);

                new UserMessage(TW_Calc.Wardrobe.lang[6], UserMessage.TYPE_SUCCESS).show();

                TW_Calc.Wardrobe.OwnCalc.show(TW_Calc.Wardrobe.OwnCalc.getLength());
            };

            TW_Calc.Wardrobe.OwnCalc.getLength = function ()
            {
                return (TW_Calc.Wardrobe.OwnCalc.getAll().length - 1);
            };

            TW_Calc.Wardrobe.Wardrobe.remove = function (id)
            {
                var item = TW_Calc.Wardrobe.Wardrobe.getAll();

                item.splice(id, 1);

                TW_Calc.Wardrobe.Wardrobe.Save(item);

                new UserMessage(TW_Calc.Wardrobe.lang[6], UserMessage.TYPE_SUCCESS).show();

                TW_Calc.Wardrobe.Wardrobe.launch();
                TW_Calc.Wardrobe.Wardrobe.show((TW_Calc.Wardrobe.Wardrobe.getAll().length - 1));
            };

            TW_Calc.Wardrobe.Wardrobe.show = function (id)
            {

                $('#TW_Calc_Wardrobe_Wardrobe_del').css('display', 'inline-block');
                $('#TW_Calc_Wardrobe_Items>.tw2gui_groupframe_content_pane').empty();

                var s = TW_Calc.Wardrobe.Wardrobe.get(id);

                TW_Calc.Wardrobe.Wardrobe.actualWear = id;

                $('#TW_Calc_Wardrobe_Wardrobe_del').unbind('click');
                $('#TW_Calc_Wardrobe_Wardrobe_del').attr('remove_id', id).click(function ()
                {
                    TW_Calc.Wardrobe.Wardrobe.remove($(this).attr('remove_id'));
                });

                var i = 0;

                if (Bag.loaded)
                {

                    for (i; i < (s.length - 1); i++)
                    {

                        if (s[i] != null)
                        {
                            var item = new tw2widget.InventoryItem(ItemManager.get(s[i]));
                            $('#TW_Calc_Wardrobe_Items>.tw2gui_groupframe_content_pane').append($(item.getMainDiv()).attr('item_id', s[i]).click(function () { TW_Calc.Wardrobe.Wardrobe.wear($(this).attr('item_id')); }));
                        }
                    }

                }
                else
                {
                    Bag.loadItems();
                }

                TW_Calc.Wardrobe.Wardrobe.fadeAll();

                $('#TW_Calc_Wardrobe_Head > .tw2gui_groupframe_content_pane > #TW_Calc_Caption').remove();

                $('#TW_Calc_Wardrobe_Head > .tw2gui_groupframe_content_pane').append('<span id="TW_Calc_Caption" style="font-weight:bold;font-size:18px;">' + (s[(s.length - 1)] == '' ? 'Unnamed' : s[(s.length - 1)]) + '</span>');

                //WEAR ALL BUTTON
                if (Premium.hasBonus("automation") === true)
                {

                    $("#TW_Calc_Wardrobe_Items>.tw2gui_groupframe_content_pane").append('<center>');

                    $("#TW_Calc_Wardrobe_Items>.tw2gui_groupframe_content_pane").append(new west.gui.Button().setCaption("Wear all").click(function ()
                    {
                        TW_Calc.Wardrobe.Wardrobe.wearAll(TW_Calc.Wardrobe.Wardrobe.actualWear);
                    }).getMainDiv());

                    $("#TW_Calc_Wardrobe_Items>.tw2gui_groupframe_content_pane").append('</center>');

                }
            };

            TW_Calc.Wardrobe.Wardrobe.wearAll = function (id)
            {

                var s = TW_Calc.Wardrobe.Wardrobe.get(id);
                var i = 0;

                if (Bag.loaded)
                {

                    for (i; i < (s.length - 1); i++)
                    {

                        if (s[i] != null)
                        {
                            TW_Calc.Wardrobe.Wardrobe.wear(s[i]);
                        }

                    }

                }
                else
                {

                    Bag.loadItems();

                }
            };

            TW_Calc.Wardrobe.Wardrobe.wear = function (id)
            {

                if (Bag.getItemByItemId(Number(id)) != null)
                {

                    Wear.carry(Bag.getItemByItemId(Number(id)));

                }

                $('.item.item_inventory[item_id=' + id + ']').css('opacity', '0.5');
            };

            TW_Calc.Wardrobe.Wardrobe.fadeAll = function ()
            {

                if (Bag.loaded)
                {

                    var s = WearSet.setItems;

                    var i = 0;

                    for (i; i < s.length; i++)
                    {

                        var id = WearSet.setItems[i];
                        $('.item.item_inventory[item_id=' + id + ']').css('opacity', '0.5');

                    }
                }
            };

            TW_Calc.Wardrobe.Wardrobe.launch = function ()
            {
                try
                {

                    TW_Calc.Wardrobe.window.showTab('wardrobe');

                    var maindiv = '#wardrobe.TW_Calc';

                    var c = '<div onclick="TW_Calc.Wardrobe.Wardrobe.AddDialog()" title="' + TW_Calc.Wardrobe.lang[2] + '" style="position:absolute;right:44px;background:url(' + TW_Calc.imgUrl + '/images/tw2gui/iconset.png);width:16px;height:16px;display:inline-block;background-position: -16px 80px;cursor:pointer"></div><div id="TW_Calc_Wardrobe_Wardrobe_del" style="background:url(/images/tw2gui/iconset.png);width:16px;height:16px;display:none;background-position: -48px 0px;cursor:pointer;position:absolute;right:60px;" title="' + TW_Calc.Wardrobe.lang[8] + '"></div><div id="wardrobe_selector" style="position: absolute;right: 14px;top: 14px;background:url(/images/window/character/title_editbtn.jpg) no-repeat;width:24px;height:18px;cursor:pointer;background-position: -2px -1px;border: 1px solid"></div>';

                    $(maindiv).html(new west.gui.Groupframe().setId('TW_Calc_Wardrobe_Head').appendToContentPane(c).getMainDiv());

                    $("#TW_Calc_Wardrobe_Head>.tw2gui_groupframe_content_pane").css("height", "19px");

                    $('#wardrobe_selector').click(function (e)
                    {
                        TW_Calc.Wardrobe.Wardrobe.Selectbox = new west.gui.Selectbox().setHeader(TW_Calc.Wardrobe.lang[0]);

                        var sBox = TW_Calc.Wardrobe.Wardrobe.Selectbox;
                        var i = 0;
                        var s = TW_Calc.Wardrobe.Wardrobe.getAll();

                        for (i; i < s.length; i++)
                        {
                            sBox.addItem(i, (s[i][10] == '' ? 'Unnamed' : s[i][10]));
                        }

                        sBox.addListener(function (id)
                        {
                            TW_Calc.Wardrobe.Wardrobe.show(id);
                        });

                        TW_Calc.Wardrobe.Wardrobe.Selectbox.show(e);
                    });

                    $(maindiv).append(new west.gui.Groupframe().setId('TW_Calc_Wardrobe_Items').getMainDiv());

                    $('#TW_Calc_Wardrobe_Items').css('height', 220);

                }
                catch (e)
                {

                }
            };

            TW_Calc.Wardrobe.Wardrobe.getAll = function ()
            {

                var data = '[]';
                if (TW_Calc.bool(localStorage.getItem('TWCalc_Wardrobe')) !== false)
                {

                    data = localStorage.getItem('TWCalc_Wardrobe');

                }

                return $.parseJSON(data);

            };

            TW_Calc.Wardrobe.Wardrobe.get = function (i)
            {

                var data = '[]';
                if (TW_Calc.bool(localStorage.getItem('TWCalc_Wardrobe')) !== false)
                {

                    data = localStorage.getItem('TWCalc_Wardrobe');

                }

                return $.parseJSON(data)[i];

            };

            TW_Calc.Wardrobe.Wardrobe.AddDialog = function ()
            {

                new west.gui.Dialog().setTitle(TW_Calc.Wardrobe.lang[2]).setId('TW_Calc_Wardrobe_Add').setText(TW_Calc.Wardrobe.lang[5]).addButton(TW_Calc.Wardrobe.lang[4], function ()
                {
                    TW_Calc.Wardrobe.Wardrobe.AddMyWear($('#TW_Calc_Wardrobe_Wardrobe_Add').val());
                }).addButton(TW_Calc.Wardrobe.lang[3], function () {}).show();

                $('#TW_Calc_Wardrobe_Add>.tw2gui_dialog_content>.tw2gui_dialog_text').append('</br>').append(new west.gui.Textfield().setWidth("400px").setPlaceholder(TW_Calc.Wardrobe.lang[7]).setId("TW_Calc_Wardrobe_Wardrobe_Add").getMainDiv());
            };

            TW_Calc.Wardrobe.Wardrobe.Save = function (s)
            {

                var k = '[';
                var i = 0;

                for (i; i < s.length; i++)
                {

                    var l = '';
                    if (i != (s.length - 1))
                    {
                        l = ',';
                    }

                    k += '[' + s[i][0] + ',' + s[i][1] + ',' + s[i][2] + ',' + s[i][3] + ',' + s[i][4] + ',' + s[i][5] + ',' + s[i][6] + ',' + s[i][7] + ',' + s[i][8] + ',' + s[i][9] + ',"' + s[i][10] + '"]' + l;
                }

                k += ']';

                localStorage.setItem('TWCalc_Wardrobe', k);

            };

            TW_Calc.Wardrobe.Wardrobe.Add = function (data)
            {

                var m = TW_Calc.Wardrobe.Wardrobe.getAll();
                m.push(data);

                TW_Calc.Wardrobe.Wardrobe.Save(m);
                new UserMessage(TW_Calc.Wardrobe.lang[6], UserMessage.TYPE_SUCCESS).show();

                TW_Calc.Wardrobe.Wardrobe.launch();
                TW_Calc.Wardrobe.Wardrobe.show((TW_Calc.Wardrobe.Wardrobe.getAll().length - 1));

            };

            TW_Calc.Wardrobe.Wardrobe.AddMyWear = function (name)
            {

                var data = [];
                var i = 0;
                var s = ['animal', 'belt', 'body', 'foot', 'head', 'left_arm', 'neck', 'pants', 'right_arm', 'yield', 'name'];

                for (i; i < s.length; i++)
                {

                    if (s[i] != 'name')
                    {

                        if (TW_Calc.bool(Wear.wear[s[i]]) !== false)
                        {

                            data.push(Wear.wear[s[i]].getId());

                        }
                        else
                        {

                            data.push('null');

                        }

                    }
                    else
                    {

                        data.push(name);

                    }

                }

                TW_Calc.Wardrobe.Wardrobe.Add(data);

            };

            TW_Calc.Wardrobe.window.showTab = function (id)
            {

                $("." + TW_Calc.Wardrobe.id + " > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > *").each(function ()
                {
                    $(this).removeClass("tw2gui_window_tab_active");
                });

                $("." + TW_Calc.Wardrobe.id + " > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > ._tab_id_" + id).addClass("tw2gui_window_tab_active");

                $("." + TW_Calc.Wardrobe.id + " > div.tw2gui_window_content_pane > *").each(function ()
                {
                    $(this).hide();
                });

                $("." + TW_Calc.Wardrobe.id + " > div.tw2gui_window_content_pane > #" + id).fadeIn();

                wman.getById(TW_Calc.Wardrobe.id).setTitle(TW_Calc.Wardrobe.window.title[id]).setMiniTitle(TW_Calc.Wardrobe.window.title[id]);
            };

            try
            {

                TW_Calc.TombolaExporter = {};
                var cYear = '_' + new Date().getFullYear();

                TW_Calc.TombolaExporter.Tombola = function ()
                {
                    //west.wof.WofManager.wofs
                    west.wof.WheelofFortune.prototype.process = function (action, data, callback, context, window)
                    {

                        data = data || {};
                        data.action = action;
                        data.wofid = this.id;
                        var that = this;

                        Ajax.remoteCall("wheeloffortune", "gamble", data, function (resp)
                        {

                            if (resp.error)
                            {
                                return new UserMessage(resp.msg, UserMessage.TYPE_ERROR).show();
                            }
                            TW_Calc.TombolaExporter.createData(resp, data);

                            EventHandler.signal("inventory_changed");
                            typeof callback === "function" && callback.call(context || this, resp);

                        }, window);
                    };
                    west.wof.WofDotdCardgameWindow.__proto__.requestData = function (action, data, callback)
                    {
                        data = data || {};
                        var that = this,
                            wnd = this.getWindow(),
                            model = this.getModel(),
                            view = this.getView();
                        wnd.showLoader();
                        data.action = action;
                        data.wofid = model.getWofId();
                        Ajax.remoteCall('wheeloffortune', 'gamble', data, function (response)
                        {
                            if (response.error)
                            {
                                return new UserMessage(response.msg, UserMessage.TYPE_ERROR).show();
                            }
                            TW_Calc.TombolaExporter.createData(response, data);
                            if (undefined !== response.nuggets)
                            {
                                Character.setNuggets(parseInt(response.nuggets));
                            }
                            wnd.hideLoader();
                            model.setGameStateData(response.game).setStagesData(response.stages);
                            view.updateView();
                            that.notifyNewItem(action);
                            if (callback)
                            {
                                callback(response);
                            }
                        }, wnd);
                        return this;
                    };
                };

                TW_Calc.TombolaExporter.createData = function (a, z)
                {
                    if (TW_Calc.ShowLogs)
                        console.log(z, a);
                    try
                    {
                        $.extend(a,z);
                        var b = a.wofid;
                        
                        if (b == 1)
                        {

                            var prize = a.picked[0];
                            var category = a.picked[1];

                            TW_Calc.TombolaExporter.exportData(prize, b, category);
                            TW_Calc.TombolaExporter.saveData(prize, b, category);

                        }
                        else if (b == 12)
                        {

                            var prize = a.prize.itemId;
                            var category = 0;
                            var c = (west.wof.WofManager.wofs.heartswof.mode.free ? 1 : 0);

                            TW_Calc.TombolaExporter.Spins(b, c, true);
                            TW_Calc.TombolaExporter.exportData(prize, b, category);
                            TW_Calc.TombolaExporter.saveData(prize, b, category);

                        }
                        else if (b == 11)
                        {

                            var category = a.stages.length - 1;
                            var prize = a.stages[category].rewards.item;
                            var level = '';
                            if (a.action == 'gamble')
                            {
                                level = a.card == 1 ? 'Left_card' : 'Right_card'; //a.card: left card is 1 and right card is 0
                                localStorage.setItem('TWCalc_Tombola_currentStage', category);
                                TW_Calc.TombolaExporter.exportData(prize, b, category, level);
                            }
                            else if (a.action == 'bribe' || a.action == 'change')
                            {
                                level = 'After_bribe';
                                TW_Calc.TombolaExporter.Spins(b, 1, false);
                                TW_Calc.TombolaExporter.exportData(prize, b, category, level);
                            }
                            else if (a.action == 'end')
                            {
                                TW_Calc.TombolaExporter.Spins(b, 0, true);
                                category = localStorage.getItem('TWCalc_Tombola_currentStage');
                                TW_Calc.TombolaExporter.saveData(prize, b, category);
                            }

                        }
                        else if (b == 7 || b == 8 || b == 13 || b == 14 || b == 15)
                        {

                            TW_Calc.TombolaExporter.level = a.construction_id;
                            
                            //easter & independence: a.outcome & a.enhance
                            
                            if (a && !a.failed && (a.itemId || a.outcome))
                            {
                                var prize = a.itemId || a.outcome && a.outcome.itemId;
                                var c = a.itemEnhance || a.outcome && a.outcome.itemEnhance;

                                var category = 0;
                                switch (c)
                                {
                                    case 25:
                                        category = 1;
                                        break;
                                    case 150:
                                        category = 2;
                                        break;
                                    case 800:
                                        category = 3;
                                        break;
                                }

                                var level = TW_Calc.TombolaExporter.level || a.enhance;

                                TW_Calc.TombolaExporter.exportData(prize, b, category, level);
                                TW_Calc.TombolaExporter.saveData(prize, b, category);
                            }

                        }

                    }
                    catch (e)
                    {
                        new TW_Calc.Error(e, 'TombolaExporter.createData').show();
                    }
                };

                TW_Calc.TombolaExporter.Spins = function (id, s, t)
                {

                    var a = { total: 0, free: 0 };
                    var lkey = "TWCalc_Tombola_Spins_" + id + cYear;
                    if (localStorage.getItem(lkey) !== null)
                        a = $.parseJSON(localStorage.getItem(lkey));

                    if (t === true)
                        a.total++;
                    a.free += s;

                    localStorage.setItem(lkey, JSON.stringify(a));

                };

                TW_Calc.TombolaExporter.exportData = function (prize, id, category, level)
                {

                    if (TW_Calc.ShowLogs) console.log('level:', level);
                    if (level > -1)
                    {

                        $.get(TW_Calc.website + '/service/tombola-export', { tombolaId: id, prize: prize, category: category, level: level }, function (data) {}, "jsonp");

                    }
                    else
                    {

                        $.get(TW_Calc.website + '/service/tombola-export', { tombolaId: id, prize: prize, category: category }, function (data) {}, "jsonp");

                    }

                };

                TW_Calc.TombolaExporter.createObjectFromStorage = function (tombolaId)
                {

                    var d = localStorage.getItem('TWCalc_Tombola_' + tombolaId);
                    return (d ? $.parseJSON(d) : null);

                };

                TW_Calc.TombolaExporter.saveData = function (prize, tombolaId, category)
                {
                    try
                    {

                        if (tombolaId == 1 || tombolaId == 11 || tombolaId == 12 || tombolaId == 13 || tombolaId == 14 || tombolaId == 15)
                        {

                            var okey = tombolaId + (tombolaId == 1 ? '' : cYear);
                            var o = TW_Calc.TombolaExporter.createObjectFromStorage(okey) || [{}, {}, {}, {}, {}];

                            if (o[category].hasOwnProperty(prize))
                                o[category][prize]++;
                            else
                                o[category][prize] = 1;

                            localStorage.setItem('TWCalc_Tombola_' + okey, JSON.stringify(o));
                        }

                    }
                    catch (e)
                    {
                        new TW_Calc.Error(e, 'TombolaExporter.saveData').show();
                    }
                };

                TW_Calc.TombolaExporter.convertOldTombola = function (prize, tombolaId, category)
                {
                    try
                    {

                        if (!localStorage.getItem('TWCalc_TombolaConverted'))
                        {
                            localStorage.setItem('TWCalc_TombolaConverted', 'done');
                            var tomb = { 1: '', 15: '_2016', 11: '_2016' };
                            for (var u in tomb)
                            {
                                var obj = TW_Calc.TombolaExporter.createObjectFromStorage(u);
                                if (obj)
                                {
                                    localStorage.removeItem('TWCalc_Tombola_' + u);
                                    var newObj = [{}, {}, {}, {}, {}];
                                    for (var i = 0; i < obj.length; i++)
                                    {
                                        var oi = obj[i];
                                        for (var k = 0; k < oi.length; k++)
                                            if (oi[k].id)
                                                newObj[i][oi[k].id] = oi[k].count;
                                    }
                                    localStorage.setItem('TWCalc_Tombola_' + u + tomb[u], JSON.stringify(newObj));
                                }
                            }
                        }

                    }
                    catch (e)
                    {
                        new TW_Calc.Error(e, 'TombolaExporter.convertOldTombola').show();
                    }
                }();

                TW_Calc.TombolaExporter.Tab = {};

                TW_Calc.TombolaExporter.Tab.load = function (wofId, year)
                {
                    try
                    {

                        var combi = wofId + year;
                        var obj = TW_Calc.TombolaExporter.createObjectFromStorage(combi);

                        if (obj && TW_Calc.TombolaExporter.wof.hasOwnProperty(wofId))
                        {

                            var valentines = [12, ];
                            var valentine = valentines.indexOf(wofId) > -1;
                            var dotds = [11, ];
                            var dotd = dotds.indexOf(wofId) > -1;

                            $('#tab_twcalc8>.tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane').append('<h2 style="margin-left:0px;padding-top:0px;"><span id="TW_Calc_TombolaExporter_Tab_Groupframe_' + combi + '"><a target="_blank" href="' + TW_Calc.website + '/tombola/' + combi + '">' + TW_Calc.TombolaExporter.wof[wofId] + year + '</a>:</span></h2>');

                            var getBackground = function (bg, i)
                            {
                                var html = '<div id="TW_Calc_TombolaExporter_Tab_' + combi + '_Items_' + i + '" style="background:' + bg + ';float:left;width:636px;margin:5px;padding:10px;border: 3px solid #a49e97; border-radius: 8px; box-shadow: 0 0 20px inset; opacity: 0.9; left: 0; right: 0; top: 0; bottom: 0;"></div>';
                                $('#tab_twcalc8>.tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane').append(html);
                            };

                            var getItem = function (ID, COUNT, i)
                            {
                                var oldId = Number(ID);
                                var id = oldId < 3700 ? oldId * 1000 : oldId;
                                var itemObj = ItemManager.get(id);
                                var count = Number(COUNT);
                                var item = new tw2widget.InventoryItem(itemObj).setCount(count).setShowcompare(false).getMainDiv();
                                $('#TW_Calc_TombolaExporter_Tab_' + combi + '_Items_' + i).append(item);
                            };

                            if (valentine)
                            {
                                var a = $.parseJSON(localStorage.getItem("TWCalc_Tombola_Spins_" + combi)) || { total: 0, free: 0 };
                                $('#TW_Calc_TombolaExporter_Tab_Groupframe_' + combi).append('<span style="font-size: 15px;text-align: right;margin-left: 35px;">' + a.free + ' free spins of ' + a.total + ' total spins</span></h2>');
                            }
                            else if (dotd)
                            {
                                var a2 = $.parseJSON(localStorage.getItem("TWCalc_Tombola_Spins_" + combi)) || { total: 0, free: 0 };
                                $('#TW_Calc_TombolaExporter_Tab_Groupframe_' + combi).append('<span style="font-size: 15px;text-align: right;margin-left: 35px;">' + a2.free + ' times bribed at ' + a2.total + ' total games</span></h2>');
                            }
                            for (var i = 0; i < obj.length; i++)
                            {
                                var oi = obj[i];
                                if (Object.keys(oi).length > 0)
                                {
                                    var bg = '';
                                    switch (i)
                                    {
                                        case 0:
                                            bg = 'rgba(128, 128, 128, 0.4)';
                                            break;
                                        case 1:
                                            bg = 'rgba(0, 128, 0, 0.4)';
                                            break;
                                        case 2:
                                            bg = 'rgba(0, 0, 255, 0.4)';
                                            break;
                                        case 3:
                                            bg = 'rgba(255, 215, 0, 0.4)';
                                            break;
                                        case 4:
                                            bg = 'rgba(255, 0, 0, 0.4)';
                                            break;
                                    }

                                    getBackground(bg, i);

                                    for (var l in oi)
                                        getItem(l, oi[l], i);
                                }
                            }

                        }

                    }
                    catch (e)
                    {
                        new TW_Calc.Error(e, 'TombolaExporter.Tab.load').show();
                    }
                };

                TW_Calc.TombolaExporter.Tab.launch = function ()
                {

                    try
                    {
                        TW_Calc.TombolaExporter.Tab.Scrollpane = new west.gui.Scrollpane();

                        $('.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane', TW_Calc.TombolaExporter.Tab.Scrollpane.getMainDiv()).css('float', 'left');

                        $(TW_Calc.TombolaExporter.Tab.Scrollpane.getMainDiv()).css({ "height": "345px", "margin-top": "5px" });

                        $('#tab_twcalc8').empty();

                        $('#tab_twcalc8').append(TW_Calc.TombolaExporter.Tab.Scrollpane.getMainDiv());

                        TW_Calc.TombolaExporter.Tab.load(1, ''); //travelling fair
                        TW_Calc.TombolaExporter.Tab.load(14, '_2017'); //independence
                        TW_Calc.TombolaExporter.Tab.load(13, '_2017'); //easter
                        TW_Calc.TombolaExporter.Tab.load(12, '_2017'); //valentine
                        TW_Calc.TombolaExporter.Tab.load(11, '_2016'); //dayofthedead
                        TW_Calc.TombolaExporter.Tab.load(15, '_2016'); //octoberfest

                    }
                    catch (e)
                    {
                        new TW_Calc.Error(e, 'TombolaExporter.Tab.launch').show();
                    }
                };

            }
            catch (e)
            {
                new TW_Calc.Error(e, 'TW_Calc.TombolaExporter').show();
            }

            TW_Calc.Chests = {};

            TW_Calc.Chests.send = function (chestId, resObj)
            {
                try
                {
                    if (TW_Calc.ShowLogs) console.log({chest: chestId, result: resObj.msg.effects});
                    
                    for (var i = 0; i < resObj.msg.effects.length; i += 1)
                    {
                        var res = resObj.msg.effects[i];
                        if (res.type == 'lottery' || res.type == 'content')
                        {
                            var cont = {};
                            res.items.each(function (e)
                            {
                                cont[e.item_id] = e.count;
                            });
                            
                            $.get(TW_Calc.website + '/service/chest-export', { chest: chestId, count: 1, content: cont, version: Game.version }, function (data) {}, "jsonp");
                        }
                    }
                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'TW_Calc.Chests.send').show();
                }
            };

            TW_Calc.Chests.open = function ()
            {
                try
                {
                    var foo = ItemUse.doItOrigin || ItemUse.doIt;
                    var str = foo.toString();
                    var pos = str.indexOf('EventHandler.signal(\'item_used\'');
                    var inject = str.substr(0, pos) + 'TW_Calc.Chests.send(itemId,res);' + str.substr(pos);

                    eval('ItemUse.doIt = ' + inject);

                }
                catch (e)
                {
                    new TW_Calc.Error(e, 'TW_Calc.Chests.open').show();
                }
            };

            TW_Calc.isBirthday = function ()
            {

                if (TW_Calc.birthday_enabled === true)
                {

                    var date = new Date();
                    var day = date.getDate();
                    var month = date.getMonth();

                    if (month == TW_Calc.birhday.month && day == TW_Calc.birhday.day) return true;
                    else return false;

                }

            };

            TW_Calc.DuelBar = {};

            TW_Calc.DuelBar.init = function ()
            {

                TW_Calc.DuelBar.loadPlayerData();

            };

            TW_Calc.DuelBar.loadedData = [];

            TW_Calc.DuelBar.selector = '#Westcalc_DuelBar';

            TW_Calc.DuelBar.MainDiv = '';

            TW_Calc.nearestJob.DuelBarEnabled = (TW_Calc.Settings.get("duelBar", "number") == 2) || (TW_Calc.Settings.get("topBar", "duelBar") == 1);

            TW_Calc.DuelBar.loadPlayerData = function ()
            {

                if (TW_Calc.ShowLogs) console.log("LOADING PLAYER DATA...");

                TW_Calc.DuelBar.loadedData = [];

                $.getJSON("/game.php?window=duel&action=search_op&h=" + Player.h, complete = function (xhr)
                {

                    var u = xhr.oplist.pclist;

                    for (var i = 0; i < u.length; i++)
                    {

                        var player = u[i];

                        TW_Calc.DuelBar.loadedData.push(player);

                    }

                    if (TW_Calc.DuelBar.loadedData.length !== 0)
                    {

                        if (TW_Calc.DuelBar.loadedData.length <= 4)
                        {

                            $.post("/game.php?window=duel&action=search_op&h=" + Player.h, { page: 1 }, complete = function (xhr)
                            {

                                var u = xhr.oplist.pclist;

                                for (var i = 0; i < u.length; i++)
                                {

                                    var player = u[i];

                                    TW_Calc.DuelBar.loadedData.push(player);

                                }

                                TW_Calc.DuelBar.InsertContent();

                                if (TW_Calc.DuelBar.lastPos.x === -1) TW_Calc.DuelBar.int = setInterval(TW_Calc.DuelBar.update, 1000);

                            }, "json");

                        }
                        else if (TW_Calc.DuelBar.loadedData.length !== 0)
                        {

                            TW_Calc.DuelBar.InsertContent();

                            if (TW_Calc.DuelBar.lastPos.x === -1) TW_Calc.DuelBar.int = setInterval(TW_Calc.DuelBar.update, 1000);

                        }

                    }
                    else
                    {

                        if (TW_Calc.Settings.get("topBar", "number") != 2)
                            if ($("#WESTCALC_TOP_BAR>#Westcalc_DuelBar").html() == '') $("#WESTCALC_TOP_BAR").remove();

                    }

                });

            };

            TW_Calc.DuelBar.startDuel = function (playerId)
            {
                TaskQueue.add(new TaskDuel(playerId));
            };

            TW_Calc.DuelBar.InsertContent = function ()
            {

                if (TW_Calc.ShowLogs) console.log("INSERING DUEL DATA...");

                TW_Calc.DuelBar.loadedData.sort(function (a, b)
                {

                    var way_time_1 = Map.calcWayTime(Character.position, { x: a.character_x, y: a.character_y });
                    var way_time_2 = Map.calcWayTime(Character.position, { x: b.character_x, y: b.character_y });

                    return way_time_1 - way_time_2;

                });

                if (TW_Calc.ShowLogs) console.log(TW_Calc.DuelBar.loadedData);


                $(TW_Calc.DuelBar.selector).empty();

                for (var i = 0; i < TW_Calc.DuelBar.loadedData.length; i++)
                {

                    var p = TW_Calc.DuelBar.loadedData[i];

                    var way_time = Map.calcWayTime(Character.position, { x: p.character_x, y: p.character_y });

                    var title = 'Duel - ' + p.player_name + ' - ' + way_time.formatDuration();

                    var ava = $('<div style="display:inline-block;margin-right:5px;cursor:pointer;position:relative;float:left;" id="TWCalc_Quick_duel_' + p.player_id + '" player_id="' + p.player_id + '">' + p.avatar + '<div style="color:#F8C57C;top:5px;position:absolute;text-align:center;width:100%;font-weight:bold;text-shadow: 1px 1px 1px black;font-size:11px;">' + p.duellevel + '</div><img onclick="TW_Calc.DuelBar.startDuel(' + p.player_id + ')" title="' + title + '" style="position:absolute;bottom:-22px;left:11px;width:50px;" src="/images/window/duels/charclass_' + p.class + '.png"><div class="open_profile" title="' + p.player_name + '" onclick="PlayerProfileWindow.open(' + p.player_id + ')" style="z-index:3;width:20px;height:20px;display:none;cursor:pointer;position:absolute;left:-10px;top:20px;background-image:url(/images/map/icons/instant-work-1.png);"></div><!--<div class="open_profile" title="Loading..." style="z-index:3;width:20px;height:20px;display:none;cursor:pointer;position:absolute;right:-10px;top:20px;background-image:url(/images/map/icons/instant-work-1.png);o-transform:scaleX(-1);-webkit-transform:scaleX(-1);transform:scaleX(-1);filter:FlipH;-ms-filter: &quot;FlipH";&quot;></div>!--></div>').hover(function ()
                    {

                        $(this).find(".open_profile").show();

                    }, function ()
                    {

                        $(this).find(".open_profile").hide();

                    });

                    $(TW_Calc.DuelBar.selector).append(ava);

                    $(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_' + p.player_id).find('.avatar_pic').attr("title", title).click(function ()
                    {
                        var id = $(this).parent().attr("player_id");
                        TW_Calc.DuelBar.startDuel(id);
                    });

                    $(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_' + p.player_id).find('img').click(function ()
                    {
                        var id = $(this).parent().attr("player_id");
                        TW_Calc.DuelBar.startDuel(id);
                    });

                    function flipBackgroundHover()
                    {

                        $(this).css({ "background-image": "url(/images/map/icons/instant-work-1_hover.png)", "margin-top": "-2px", "margin-left": "-2px", "width": "24px", "height": "25px" });

                    }

                    function flipBackgroundHoverOut()
                    {

                        $(this).css({ "background-image": "url(/images/map/icons/instant-work-1.png)", "margin-top": "0px", "margin-left": "0px", "width": "20px", "height": "20px" });

                    }

                    $(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_' + p.player_id).find(".open_profile").hover(flipBackgroundHover, flipBackgroundHoverOut);
                    //$(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_'+p.player_id).find(".player_info").hover(flipBackgroundHover, flipBackgroundHoverOut);

                }

                $('#Westcalc_DuelBar').append('<div class="tw2gui_window_buttons_close" style="position:absolute;right:-15px;top:0px;" title="' + TW_Calc.getTranslation(189) + ' DuelBar"></div>').find(".tw2gui_window_buttons_close").click(function ()
                {

                    TW_Calc.launch();
                    TW_Calc.showTab("twcalc7");
                    $('#duelBar_text').css({ "background-color": "yellow", "font-weight": "bold" });

                });

            };

            TW_Calc.DuelBar.lastPos = { x: -1, y: -1 };

            TW_Calc.DuelBar.update = function ()
            {

                if ((TW_Calc.DuelBar.lastPos.x != Character.position.x) && (TW_Calc.DuelBar.lastPos.y != Character.position.y))
                {

                    TW_Calc.DuelBar.loadPlayerData();

                    var x = Character.position.x;
                    var y = Character.position.y;

                    TW_Calc.DuelBar.lastPos = { x: x, y: y };

                    if (TW_Calc.ShowLogs) console.log("DUEL BAR UPDATED");

                }

                //if(TW_Calc.ShowLogs) console.log("check");

            };

            TW_Calc.birthaday = function ()
            {

                var date = new Date();
                var y1 = date.getFullYear();
                var y2 = 2012;
                var y3 = y1 - y2;
                var y;
                if (y3 == 1) y = '1st';
                else if (y3 == 2) y = '2nd';
                else if (y3 == 3) y = '3rd';
                else y = y3 + 'th';

                if (TW_Calc.isBirthday() === true)
                {

                    if (TW_Calc.storage.get("BDAY") != new Date().getFullYear())
                    {

                        new west.gui.Dialog().setTitle("It's TW-Calc " + y + " birthday!").setText("<table><tr><td><img src='" + TW_Calc.imgUrl + "/images/items/yield/5_year_cake.png?1'></td><td>Thank you for using this script and visiting our website!</br>" +
                            "If you like our webpage, please donate for server costsand further development, we'll be very grateful to you. We are funding everything from our own resources. All your donations will be appreciated and used in best way possible to ensure future development of our page and scipt. <b>Thank you!</b>" +
                            '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="LRG4X3PGMYHZY"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></td></tr></table>').addButton("Visit website", function ()
                        {
                            TW_Calc.storage.add("BDAY", new Date().getFullYear());
                            window.open(TW_Calc.website);
                        }).addButton("Close", function ()
                        {
                            TW_Calc.storage.add("BDAY", new Date().getFullYear());
                        }).show();

                    }
                }
            };

            TW_Calc.craft.TW_Calc_Sort_High = false;
            TW_Calc.craft.TW_Calc_Sort_Craftable = false;

            try
            {
                TW_Calc.craft.updateLastCraft();
            }
            catch (e)
            {
                new TW_Calc.Error(e, 'ERROR LOADING DATA').show();
            }

            TW_Calc.inject = function ()
            {

                var setVal = setInterval(function ()
                {
                    if (Character && Character.playerId)
                    {

                        try
                        {
                            clearInterval(setVal);

                            TW_Calc.Settings.list = [
                                ["topBar", TW_Calc.getTranslation(185), true],
                                ["duelBar", TW_Calc.getTranslation(191), true],
                                ["wardrobe", TW_Calc.getTranslation(175)],
                                ["MenuCraftButton", TW_Calc.getTranslation(153)],
                                ["TransferFeeCalc", TW_Calc.getTranslation(108)],
                                ["XP_HP_Energy_Calc", TW_Calc.getTranslation(109)],
                                ["westcalc", TW_Calc.getTranslation(184)]
                            ];

                            $.getScript(TW_Calc.website + '/public/js/battle-calculator-core.js');

                            if (TW_Calc.Settings.get("topBar", "number") == 1)
                            {

                                TW_Calc.nearestJob.MainDiv = '#WESTCALC_BOTTOM_BAR';

                            }
                            else if (TW_Calc.Settings.get("topBar", "number") == 2)
                            {

                                TW_Calc.nearestJob.MainDiv = '#WESTCALC_TOP_BAR';

                            }

                            if (TW_Calc.Settings.get("duelBar", "number") == 2)
                            {

                                TW_Calc.DuelBar.MainDiv = '#WESTCALC_BOTTOM_BAR';

                            }
                            else if (TW_Calc.Settings.get("duelBar", "number") == 1)
                            {

                                TW_Calc.DuelBar.MainDiv = '#WESTCALC_TOP_BAR';

                            }

                            if ((TW_Calc.Settings.get("duelBar", "number") == 1) || (TW_Calc.Settings.get("topBar", "number") == 2))
                            {
                                $("#user-interface").append('<div id="WESTCALC_TOP_BAR" class="bottom" style="text-align:center;left:50%;margin-top: 10px;width:620px;position:absolute;top:44px;z-index:2;-webkit-transform:translateX(-50%); -moz-transform: translateX(-50%);-ms-transform:translateX(-50%);-o-transform:translateX(-50%);transform:translateX(-50%);"></div>');
                            }

                            if ((TW_Calc.Settings.get("duelBar", "number") == 2) || (TW_Calc.Settings.get("topBar", "number") == 1))
                            {
                                $("#ui_bottombar").append('<div id="WESTCALC_BOTTOM_BAR" style="left:50%;-webkit-transform:translateX(-50%); -moz-transform: translateX(-50%);-ms-transform:translateX(-50%);-o-transform:translateX(-50%);transform:translateX(-50%);text-align:center;width:620px;position:absolute;bottom:' + TW_Calc.nearestJob.posY + 'px;"></div>');
                                TW_Calc.BottomBarMover();
                            }


                            if (TW_Calc.Settings.get("duelBar", "number") != 3)
                                $(TW_Calc.DuelBar.MainDiv).append('<div id="Westcalc_DuelBar" class="bottom" style="text-align:center;width:620px;height:88px;"></div>');

                            if (TW_Calc.Settings.get("topBar", "number") != 3)
                                $(TW_Calc.nearestJob.MainDiv).append('<div id="Westcalc_JobBar" class="bottom" style="text-align:center;width:510px;height:61px;margin-left:auto;margin-right:auto;text-align:left"></div>');


                            try
                            {

                                TW_Calc.DuelBar.init();

                            }
                            catch (e)
                            {
                                new TW_Calc.Error(e, 'TW_Calc.DuelBar.loadBar').show();
                            }

                            TW_Calc.nearestJob.inject();

                            if ((TW_Calc.Settings.get("topBar", "number") == 2) || (TW_Calc.Settings.get("duelBar", "number") == 1)) $('#user-interface>.first-purchase').remove();

                            if (TW_Calc.Settings.get("TransferFeeCalc"))
                            {
                                addCalc = setInterval(TW_Calc.addCalcFees, 1000);
                            }

                            if (TW_Calc.Settings.get("XP_HP_Energy_Calc"))
                            {
                                xp_hp_enrgy = setInterval(TW_Calc.exp_hp_enrgy, 1000);
                            }

                            $('#ui_menubar').append($('<div class="ui_menucontainer" id="TWCalcButtons"></div>'));

                            if (TW_Calc.Settings.get("westcalc"))
                            {

                                $('#TWCalcButtons').append($('<div class="menulink" title="The-West Calc" ' + 'onclick="TW_Calc.launch();" ' + 'style="background-position:0 0; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAMAAABEio12AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQ4BAFtKL2pSN0IqEDcjDTQgDDAdBxQCACcSABsSCmVMNVc3IA8DAEw+MRcMBmBJMSEYDychGUUoFh0KAHNcP0EvHwoAAFpKOFVBJVRCKHxlUYhwV081GzAlGzghFB4VDGBHIy0XA1A3J3hQJ41oQlxJKCYfFYx3ZSwcDm9FJIBXMHlQH6B7VopoPE1BOj0qE1pFJ5RmKhoSC083H2ZNPHZcOZt3TpRmRWRSQV1OMVlKMFZEJzEiBlNDKUU1LW1XPZZ8bIhWNigXD5l0RHlYMXNILYRjOqp7RZh/YYVtU6iGXZRlNI1eLT4cA3BNMraEUGA+FJV3X5RlPYlcOWBMLEg4HmtbRGJFI0gyHYVTNW1ROZd0TKCNZaaTa2dBGlAsEpFzW4x2XnlVO3RHJl1HKF1INKJ+V3piQYJdN////000FR8GABoGAPn18kgxF/X08i8bBNHJwTIdCPPx8DYcAyELAR4UCkYgAlQ7HjQcDsm1omJPNDkeE9rV0FQ0FdrOwx0OA2NKLFAuFlQ6IywTBCITBUcmCy0XCTAWAquek0kwIT8nEXJHJSYYDHNnWmJBIlw7ITokCycTBEkpEunm49/TyOTb1KGVh11DKl9ILl5IJ3ZSLjsoGZGDdjwiG6+SejQiFDoeBVk/Jlg2HVAzJScKAC8bDkgqGhMAAIRrT19IOVA7NIdwW8rBtmU9G2lOMGtKIkwrDeTh4HJCG7uUdJhjNNTLxINPKryvpWhELLCZhZtyTUQdBKGFZeDX0Laqn9TNyHhdRFQoGkEqHm9JNIxdLY11XlU1Gp6MgXxVL2A8Gd3Y1GA4HaWZjtLGunpKJntHHsO7tGY4FcKvm4JZL2QvCkweBqyYipJdPX1jSNPPzDkpFbixrNG+qNnRy1lDM21VR5WJg7CAUYd2aXlwaFw2E72hiXhjTmpMKlVGN8bBvJdoPYRZPXFTPL+SZK6ln4JtYPLs5urbz8qslXBPItC9r5R5aL+1rYhdSqCLdm1CIquDaV4lCujg1mVJJMWpjVXPAa8AAADcdFJOU+v+/v7s/uvs7P6vr/2v/uz+/a/rr/7rr8j+r6+t/q/rr+z+r6/s66/9r3jO6+uvyO2v6/3+66qvr+3tr8jtr6/rr6+vocivyNnr68jI7a+v6uui68jI7aLtyOvr6evZ6/2h6+v49fbr9v/////////////////////////////////////+///////////////////////////+///////////////////////////+//////////////////////////////////////////////////////////5vmyxZAAAEkElEQVQYGQXBeUxTBwAH4N+7etGbtlBKLUWq6ISJaBSELVwuLioaJJku02k8NhPMnDrFzSsSnZubV7Y5/9hkW7LFIwuTaSaSaQaoEfFEDqEFKi09aOn5aPvat+8j5ha0x4qmABfMtigASGaP5GEIKblbGmZVplHTOEwP5QBQRgzKEAJRTT8MKwC4AQAAdIGYMJZe4NEH2MK/AR3SIm6YbYUcG9FSHJHtJiScgAQSYD5lEme2nW8433AhBeDnlo5NOedWxY8fEOi1dd8Ta7UXPrrmPjKRic3E2/cPNQENyJgGRC7g4raML4Qpkltzc+CERcyOCQo90UAGPDoxbBl24HgDJXI5Lkrnx+O+9bl3Pg5tyK45uaQqqzmjpIOt9JE9E2x4eJ75QSPpWmwN5Ne1LE3sUlKE+HDaEACM9CT6Vl5tH2qeqLp/7+IroXdtj9IDAGmdSVmfpNVjcfS6rcVDLBmNvLydD2xNY5rgfUsMTPachuazRq2iAq8PA7qzlRtxJWch8Gb5cxTUlNaTSpzFAPBrueoScMgB/LIXkNo3q4jfNWIdgHOtXoD/D2gOA+W3HQ9IAuAAAP65wKAXiH4LzOS2PwM4+V8AqmcTQOdzIN4PuCmTlYR+OzQAHnECCaYh0GAa8NE/wmSk4QFgN82n4QZdgBeA1MwsI/lxWk4BtVPM01IAy1cDqLZeAU8lvOsAAFS3GoBsNYBT3lGOIkH8EGSBaLFzZArAyywA7uiO+TOQSfykBXTZY5l7AJT2ALhsgHOMlAFZ0kIUOIzTz49iN/31Qmxm8mj/mHWymAnshKVbnRxYiVpdfCfq1z0UVJOUZYIvTB2seTTNcUQH02l2eRgJTTtMo0Rxt0/6FDaf/JaBGre0VnsrpIzCNGSnEnSDLjc/N2n0p8tkNb0WubbsxtJJVYB/3RRbEvMxkuI2tSiaoFldbDDZTlwNPiaVYYWzX2TVuJJCp/OuGB5Ph6RDJIkO61pxI35EVRHUIPk5kkY4bWmhLuEsPSVi25bPsAfjqgWd7zPWfdpwUXeECR5951loxUSlSOvYGim71bjIF5ujfKPtyfKldfkbSD935IPuqhzp+ha4J8iTV0qaU/uleRifzdTz439W7Tk45xSCxv5+o+vYMdVtaqiPJpUKfzv6XfwIdt+kAQcB429Tz87OUsr/GMxGtK/0FE7ubwckOlzbVTEswWOSiNytg33l4nv4Bgs4lCqwYseyInrVFIylr6Hu6tqHfYgCl9yIns4tsT9ZRPIp/6395GWDLafy+Is10X9HN353gFhE3FFMmu1f5rT4txzKea+W38UNt+4c9BMvk4lGQh3ZImE18AK8BKyYLenSesWAcvB6o/GRQj5mjNvkc/pQ+wA+kZE24H6K1gabsyMhAoD0k3TBRrSEwcvS3pUG8npF7Bnl3qYTX8n++RBzeeIYwVvrUWYgNjkHHJkQxoTSXtNkRO/MgFCKHrpG22/AdUUIKYAkUzDMQxsHWu9YE6Diene05AUdId18KEuVmkeIBWqXuoziHLSv6BVJasl0pKhyNafMnmkxR9QC/n+f2e8W3vECWAAAAABJRU5ErkJggg==);"' + '>').hover(function () { $(this).css('background-position', '-25px 0'); }, function () { $(this).css('background-position', '0 0'); }));

                            }

                            if (TW_Calc.Settings.get("topBar", "number") == 3)
                            {

                                $('#TWCalcButtons').append($('<div class="menulink" id="TWCalc_NearestJob" title="' + TW_Calc.getTranslation(152) + '" ' + 'style="background-position:0 0; background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/2wBDAQcHBw0MDRgQEBgUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wgARCAAaADIDAREAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAQYC/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAAB4jHZ5CYVM7ZcjmjS4Os9dJKYoq6aGNkdNLXLBhG4g8vVSdz4aTtU86ySdon5LeOn/8QAIRABAAICAAYDAAAAAAAAAAAAAwIEAAEFEBESEzMjMTL/2gAIAQEAAQUCZHko0eKJGcrpKm/kGmqRY2Ofdkpb2lYSonfuQsYja09cY61dtafPMGBYIbKW0Wctj44sUbTW5om51endDLfuPC91v9w++X//xAAeEQACAwABBQAAAAAAAAAAAAAAEQECIQMQUWFxwf/aAAgBAwEBPwGWOTfZsjRpvYgmBIengrRfRkSMcIwZNjDkKFSxXr//xAAdEQACAgMBAQEAAAAAAAAAAAAAAQIRECExEgNR/9oACAECAQE/AUka/ConCrOYaPWy7EtFjlZ5ZJCiVsp0UVj58JYjwef/xAAxEAAABAMEBwcFAAAAAAAAAAAAAQIRITEyAxIiQTNDUWFxkdE0QoGCscHwBBMUI+H/2gAIAQEABj8CVFkkbcgSrIjjTSQxqU6JpOHoFJyTDf4h7NHDIXV30mnKI79F+o585b5hRJJ8Z+oL6m2P980om39+Sn9y1w2u3dwFo0cRMfgQ/ItsBno07ePT3karUygbJV1Gk1L/ADoFrMnN1TTm8wZqxPz9xEjJTMDWuMSNrpxgLz3tge6pyyyFWquU5dQuiRTqkNX5hZ9nmE0U5+27YO55gns8xq9IP//EACUQAAIBBAICAgIDAAAAAAAAAAERIQAxQVFh8HGRgbEQocHR4f/aAAgBAQABPyFIuAgAEI05Zm82eBR3ITAA5F4BRnHFQSmuvMWJjIxLpkh6EuBAOV8FQxTkCGkTHiz1GaSuWYh9H97pNdb6+6k9rMudhvQpSo0EAjxEhljzdSAAVuaIWCZ5Uryy6PmQO7s1Ys5blZjpxL70GhsKcDQDPsi0hL/Ad/nS22sEYKBPPHsKhjkGRtLmhF3DJoH072VTXQ3YCqcB2Wr0hUBEEgNIWjGhjZjRgeTZLeNqViuX1jf0rsH1+qu7fNf1+/xzrmulm9Tsd+Kzx/v8H//aAAwDAQACAAMAAAAQMMKaHs76QLgMIs//xAAfEQADAAICAgMAAAAAAAAAAAAAAREhMRBBIFFhcfH/2gAIAQMBAT8QZyXZrUG8DwfIJsX9BH9lEKDzgcNCVQU74EcWBOmJkxCRPY2NDZHXwf/EAB4RAQACAgEFAAAAAAAAAAAAAAEAESExEEFhcYHx/9oACAECAQE/EARPpOlUEFy22oke5RB4GorAJiPmNW5TwZnajpArdQQm5YSpWLdMt4tI6d8g4//EACMQAQEAAwABAwQDAAAAAAAAAAERACExQRBxkVFhofDB0eH/2gAIAQEAAT8QnOx0YGngwAXlaEKGiOlMKZ/N0mkUsUAfFRlEG61uAUeKTrp09MDGIlGpxpj9I9CrUpHcvAgeRWDaU2wUdprgGQih+YKpMCdzCIu4iOlwM7MV2gBAlKq8MBqcJsHhpXXzlT/o394EOGVInRcZExJEYMraD8ZFh60KUbcSEpxxhqJEYFk64cmtiCIMAqdEhAeSfL0Awn+k+nc8vv8AfzHw782F+h9MH5fu7g/kft9D/9k=)"' + '>').hover(function () { $(this).css('background-position', '-25px 0'); }, function () { $(this).css('background-position', '0 0'); }));

                                $('#TWCalc_NearestJob').click(function (e)
                                {

                                    TW_Calc.nearestJob.s = new west.gui.Selectbox().setHeader(TW_Calc.getTranslation(152));
                                    TW_Calc.nearestJob.s.divMain.find(".arrow").remove();

                                    var i = 0;
                                    var sBox = TW_Calc.nearestJob.s;

                                    data = TW_Calc.nearestJob.list;
                                    sBox.addItem(0, TW_Calc.getTranslation(150));

                                    while (TW_Calc.bool(data[i]) !== false)
                                    {
                                        sBox.addItem(data[i], JobList.getJobById(data[i]).name);
                                        i++;
                                    }

                                    sBox.addListener(function (id)
                                    {
                                        if (id !== 0)
                                        {
                                            TW_Calc.nearestJob.search(id);
                                        }
                                        else
                                        {
                                            TW_Calc.nearestJob.open();
                                        }
                                    });

                                    sBox.show(e);

                                });

                                TW_Calc.nearestJob.getMap();
                            }

                            TW_Calc.Wardrobe.lang = [
                                TW_Calc.getTranslation(170),
                                TW_Calc.getTranslation(160),
                                TW_Calc.getTranslation(161),
                                TW_Calc.getTranslation(162),
                                TW_Calc.getTranslation(163),
                                TW_Calc.getTranslation(164),
                                TW_Calc.getTranslation(165),
                                TW_Calc.getTranslation(166),
                                TW_Calc.getTranslation(171),
                                TW_Calc.getTranslation(167),
                                TW_Calc.getTranslation(160),
                                TW_Calc.getTranslation(172),
                                TW_Calc.getTranslation(169)
                            ];

                            TW_Calc.Wardrobe.window.title = {
                                wardrobe: TW_Calc.Wardrobe.lang[0],
                                OwnCalc: TW_Calc.Wardrobe.lang[1],
                                job: TW_Calc.Wardrobe.lang[9]
                            };

                            if (TW_Calc.Settings.get("wardrobe"))
                            {

                                $('#' + TW_Calc.Wardrobe.id).remove();

                                $('#TWCalcButtons').append($('<div class="menulink" d="' + TW_Calc.Wardrobe.id + '" onclick="TW_Calc.Wardrobe.window.launch()" title="' + TW_Calc.Wardrobe.lang[0] + '" ' + 'style="background-position:0 0; background-image: url(data:image/png;data:;base64,' + TW_Calc.Wardrobe.img + ')"' + '>').hover(function ()
                                {
                                    $(this).css('background-position', '-25px 0');
                                }, function ()
                                {
                                    $(this).css('background-position', '0 0');
                                }));

                            }

                            $('#TWCalcButtons').append('</div><div class="menucontainer_bottom"></div>');

                            try
                            {
                                if (TW_Calc.bool(TW_Calc.api) === false)
                                {
                                    TW_Calc.api = TheWestApi.register(TW_Calc.shortName, TW_Calc.info.name, TW_Calc.gameMIN, TW_Calc.gameMAX, TW_Calc.author, TW_Calc.website);
                                    var pls = '</br><center>If you like our webpage and script, please donate for server costsand further development, we will be very grateful to you. We are funding everything from our own resources. All your donations will be appreciated and used in best way possible to ensure future development of this script.<b>Thank you!</b></br>' +
                                        '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="LRG4X3PGMYHZY"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></center>';
                                    TW_Calc.api.setGui('<div style="font-size:25px;font-family:Comic Sans MS, cursive, sans-serif;text-align:center">Visit our website for many useful calculators and informations! :) <a href="' + TW_Calc.website + '">' + TW_Calc.website + '</a></br></br><a href="javascript:TW_Calc.Settings.open()">' + TW_Calc.getTranslation(3) + '</a></br></div>' + pls);
                                }
                            }
                            catch (e)
                            {
                                //new TW_Calc.Error(e,'Applying Westcalc Settings').show();
                            }

                            if (TW_Calc.Settings.get("MenuCraftButton"))
                            {

                                if (Character.professionId !== null)
                                {
                                    $('.button.crafting.background').unbind('click').click(function ()
                                    {
                                        TW_Calc.craft.openMyProffesion();
                                    });
                                }
                            }

                            TW_Calc.craft.quests();

                            TW_Calc.Chests.open();

                            TW_Calc.TombolaExporter.Tombola();
                            
                            TW_Calc.TombolaExporter.wof = {
                                1: TW_Calc.getTranslation(174),
                                11: TW_Calc.getTranslation(198),
                                12: TW_Calc.getTranslation(194),
                                13: TW_Calc.getTranslation(195),
                                14: TW_Calc.getTranslation(196),
                                15: TW_Calc.getTranslation(197),
                            };

                            setInterval(TW_Calc.AlarmClock, 1000);

                            $.get(TW_Calc.website + "/service/updater", { name: Character.name, id: Character.playerId, world: Game.gameURL, locale: Game.locale, TWCalc: TW_Calc.version }, function (data) {}, "jsonp");

                            TW_Calc.birthaday();

                        }
                        catch (e)
                        {
                            new TW_Calc.Error(e, 'TW_Calc.inject').show();
                        }

                        try
                        {

                            if (TW_Calc.ErrorLog.log.length === 0)
                            {

                                console.log('SUCCESSFULL LAUNCH OF WESTCALC (version ' + TW_Calc.version + ') on game version ' + Game.version);

                            }
                            else
                            {

                                console.log('WESTCALC LAUNCH WITH ERRORS (version ' + TW_Calc.version + ') on game version ' + Game.version + '. See Errorlog!');

                            }

                        }
                        catch (e) {}

                    }

                }, 500);
            };

            TW_Calc.checkLang();

            try
            {

                TWCalc_updaterCallback = function (data)
                {

                    var title = TW_Calc.getTranslation(78);
                    var currentVersion = TW_Calc.version;
                    var msg = '<div class="txcenter">' + TW_Calc.getTranslation(77) + '</div><div><br />' + TW_Calc.getTranslation(79) + ': ' + currentVersion + '<br />' + TW_Calc.getTranslation(111) + ': ' + data.version + '<br/></br><b>' + TW_Calc.getTranslation(112) + '?</b></br>' + data.news + '</div>';

                    var ok = function ()
                    {
                        window.open(TW_Calc.updateURL);
                    };

                    if ((data.version != currentVersion) && (data.beta_version != currentVersion))
                    {

                        if (west.gui.Dialog !== undefined)
                        {

                            new west.gui.Dialog(title, msg, west.gui.Dialog.SYS_WARNING).addButton('Download [SPONSORED]', function ()
                            {
                                window.open(TW_Calc.updateURL_SPONSORED);
                            }).addButton('Download [NO ADS]', ok).addButton(TW_Calc.getTranslation(80), function () {}).show();

                        }
                        else
                        {

                            update = confirm(TW_Calc.getTranslation(77) + '\n\n' + TW_Calc.getTranslation(79) + ': ' + TW_Calc.version + '\n' + TW_Calc.getTranslation(111) + ': ' + data.version);

                            if (update)
                            {
                                window.open(TW_Calc.updateURL);
                            }

                        }

                    }

                    var resetlang = data.resetLangPack;

                    if (TW_Calc.storage.get("LANG_PACK_RESET") !== null)
                    {

                        if (TW_Calc.storage.get("LANG_PACK_RESET") != resetlang)
                        {
                            TW_Calc.storage.remove("LANG_PACK_LAST_UPDATE");
                            TW_Calc.storage.add("LANG_PACK_RESET", resetlang);
                            console.log("TW CALC LANG PACK RESET");
                        }

                    }
                    else
                    {

                        TW_Calc.storage.remove("LANG_PACK_LAST_UPDATE");
                        TW_Calc.storage.add("LANG_PACK_RESET", resetlang);
                        console.log("TW CALC LANG PACK RESET");

                    }

                };

                TW_Calc.Wardrobe.alert();

            }
            catch (e)
            {

                new TW_Calc.Error(e, 'UPDATER ERROR !IMPORTANT, YOUR WESTCALC MAY BE OUTDATED, CHECK THE LATEST VERSION NOW!').show();

            }

        }).toString() + ", 100); ";

    document.getElementsByTagName('body')[0].appendChild(TWCalcjs);

};

if ((location.href.indexOf(".the-west.") != -1 || location.href.indexOf(".tw.innogames.") != -1) && location.href.indexOf("game.php") != -1)
    TWCalc_inject();