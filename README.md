# Planico – Dein smarter Haushaltsplaner

Planico ist eine kleine React-Anwendung, mit der sich Haushaltsaufgaben komfortabel verwalten lassen. Nach dem Login können Aufgaben erstellt, gefiltert und anderen Benutzer:innen zugewiesen werden. Die Bedienoberfläche basiert auf [UI5 Web Components](https://sap.github.io/ui5-webcomponents/) und verwendet Tailwind für eigenes Styling.

## Zweck der App

- **Gemeinsame Organisation:** Familienmitglieder oder Wohngemeinschaften behalten anstehende Haushaltsaufgaben im Blick.
- **Aufgabenverwaltung:** Aufgaben lassen sich erfassen, mit Fälligkeitsdatum versehen und als wiederkehrend kennzeichnen.
- **Filterfunktion:** Offene Aufgaben oder nur die eigenen Aufgaben können angezeigt werden.
- **Bearbeitung im Browser:** Aufgaben können direkt angepasst, einem Benutzer zugewiesen oder als erledigt markiert werden.

Die Anwendung kommuniziert dafür mit einer externen REST-API (`https://api.possiblyfour.com:5001`), die Aufgaben und Benutzer verwaltet.

## Technische Details

- **Framework:** [Create React App](https://create-react-app.dev/) dient als Basis.
- **UI:** Komponenten stammen von `@ui5/webcomponents-react` und `@shadcn/ui`.
- **State-Management:** React Hooks (`useState`, `useEffect`) verwalten Aufgaben und Login-Status.
- **Authentifizierung:** Login/Registrierung speichern ein JWT sowie Benutzer-ID im `localStorage`.
- **Build-Skripte:** übliche `npm`-Skripte (`start`, `build`, `test`) sind vorhanden.

Zum lokalen Starten genügt:

```bash
npm install
npm start
```

Die App läuft anschließend unter `http://localhost:3000`.

## Mögliche Erweiterungen

- **Push-Benachrichtigungen:** Erinnerung an fällige Aufgaben via Browser- oder Mobil-Benachrichtigungen.
- **Gemeinsame Kalenderansicht:** Aufgaben könnten in einem Kalender dargestellt werden, um freie Tage zu erkennen.
- **Gamification:** Punkte oder Abzeichen für erledigte Aufgaben sorgen für Motivation.
- **Statistiken:** Diagramme zeigen, wer welche Aufgaben übernimmt und wie viele offen sind.
- **Offline-Unterstützung:** Dank PWA-Funktionen wären Listen auch ohne Internet nutzbar.

Viel Spaß beim Planen!
