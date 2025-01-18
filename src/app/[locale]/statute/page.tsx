'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Page() {
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});
  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = [
    {
      id: 1,
      title: '§1. Postanowienia ogólne',
      content: [
        '1. Niniejszy regulamin określa zasady korzystania z serwisu internetowego CargoLink, dostępnego pod adresem CargoLink.com.',
        '2. Właścicielem i administratorem serwisu CargoLink jest Krystian Tomczyk.',
        '3. Regulamin jest napisany tylko w języku polskim',
        '4. Użyte w Regulaminie pojęcia oznaczają:',
        '   - Serwis - platforma internetowa CargoLink',
        '   - Użytkownik - osoba fizyczna lub prawna korzystająca z Serwisu',
        '   - Przewoźnik - Użytkownik świadczący usługi transportowe',
        '   - Zleceniodawca - Użytkownik zlecający transport towarów',
        '   - Ogłoszenie - informacja o planowanej trasie lub zapotrzebowaniu na transport',
      ],
    },
    {
      id: 2,
      title: '§2. Rejestracja i konto użytkownika',
      content: [
        '1. Korzystanie z pełnej funkcjonalności Serwisu wymaga utworzenia konta.',
        '2. Podczas rejestracji Użytkownik zobowiązany jest do:',
        '   - Podania prawdziwych danych osobowych lub firmowych',
        '   - Utworzenia bezpiecznego hasła',
        '   - Zapoznania się i akceptacji niniejszego Regulaminu',
        '3. Użytkownik ponosi pełną odpowiedzialność za bezpieczeństwo swojego konta oraz działania wykonywane za jego pośrednictwem.',
      ],
    },
    {
      id: 3,
      title: '§3. Zasady publikowania ogłoszeń',
      content: [
        '1. Każde ogłoszenie przed publikacją podlega weryfikacji przez moderatorów Serwisu.',
        '2. Ogłoszenia muszą zawierać prawdziwe i dokładne informacje dotyczące:',
        '   - Trasy transportu',
        '   - Terminów',
        '   - Parametrów ładunku lub pojazdu',
        '3. Zabrania się publikowania ogłoszeń:',
        '   - Dotyczących towarów nielegalnych',
        '   - Zawierających nieprawdziwe informacje',
        '   - Naruszających prawa osób trzecich',
        '   - Powielających istniejące ogłoszenia',
      ],
    },
    {
      id: 4,
      title: '§4. Realizacja transportu',
      content: [
        '1. Serwis pełni rolę platformy łączącej Przewoźników ze Zleceniodawcami i nie jest stroną zawieranych umów transportowych.',
        '2. Użytkownicy zobowiązani są do:',
        '   - Przestrzegania ustalonych warunków transportu',
        '   - Terminowej realizacji zobowiązań',
        '   - Zapewnienia deklarowanych warunków przewozu',
        '3. Wygenerowany przez Serwis szablon umowy stanowi jedynie propozycję i może być modyfikowany przez strony.',
      ],
    },
    {
      id: 5,
      title: '§5. System ocen i opinie',
      content: [
        '1. Użytkownicy mogą wystawiać sobie wzajemne oceny po zakończeniu realizacji transportu.',
        '2. Oceny muszą:',
        '   - Odzwierciedlać rzeczywisty przebieg współpracy',
        '   - Nie zawierać treści obraźliwych lub nieprawdziwych',
        '   - Zostać wystawione w terminie do 14 dni od zakończenia transportu',
        '3. Administrator zastrzega sobie prawo do usuwania ocen naruszających Regulamin.',
      ],
    },
    {
      id: 6,
      title: '§6. Komunikacja między użytkownikami',
      content: [
        '1. Serwis udostępnia system komunikacji wewnętrznej (czat).',
        '2. Użytkownicy zobowiązują się do:',
        '   - Prowadzenia komunikacji w sposób kulturalny',
        '   - Nieudostępniania treści niepożądanych lub szkodliwych',
        '   - Wykorzystywania czatu wyłącznie do celów związanych z realizacją transportu',
      ],
    },
    {
      id: 7,
      title: '§7. Odpowiedzialność',
      content: [
        '1. Serwis nie ponosi odpowiedzialności za:',
        '   - Prawdziwość informacji podawanych przez Użytkowników',
        '   - Jakość wykonanych usług transportowych',
        '   - Szkody powstałe w wyniku realizacji transportu',
        '   - Treść korespondencji między Użytkownikami',
        '2. Użytkownicy ponoszą pełną odpowiedzialność za swoje działania w Serwisie.',
      ],
    },
    {
      id: 8,
      title: '§8. Ochrona danych osobowych',
      content: [
        '1. Administrator przetwarza dane osobowe zgodnie z obowiązującymi przepisami RODO.',
        '2. Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się w Polityce Prywatności.',
      ],
    },
    {
      id: 9,
      title: '§9. Postanowienia końcowe',
      content: [
        '1. Administrator zastrzega sobie prawo do:',
        '   - Modyfikacji Regulaminu',
        '   - Czasowego lub stałego ograniczenia dostępu do Serwisu',
        '   - Usuwania kont naruszających Regulamin',
        '2. O wszelkich zmianach w Regulaminie Użytkownicy będą informowani z wyprzedzeniem.',
        '3. Regulamin wchodzi w życie z dniem [data].',
      ],
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Regulamin serwisu CargoLink</h1>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between rounded-md px-6 py-4 transition-colors duration-150 hover:bg-slate-700"
              >
                <h2 className="text-lg font-medium">{section.title}</h2>
                {expandedSections[section.id] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedSections[section.id] && (
                <div className="px-6 py-4">
                  {section.content.map((item, index) => (
                    <p key={index} className="mb-2 whitespace-pre-wrap">
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
        </div>
      </div>
    </div>
  );
}
