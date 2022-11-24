# DRG Strat Roulette

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.8.

## Planned features

-   [x] Roll a random strategy
-   [x] Exclude strategies with certain tags
-   [x] Exclude strategies based on team setup
-   [x] Select multiple dwarves you would be comfortable being
-   [x] Roll strategies which are possible given a pre-defined mission
-   [x] Cache config data (settings and current strat(s))
-   [x] Share strategy via links (manually copy/paste URL)
-   [x] Share strategy via links (share button to clipboard)
-   [x] Option to automatically make necessary RNG choices
-   [x] Copy to clipboard for intro and/or current strat explanations
    -   (e.g. "who is the designated medic?")
-   [x] Option to re-roll generated content
-   [x] Make the UI prettier
    -   [x] DRG themed
    -   [x] Background images
    -   [x] Favicon
    -   [x] Clean display of selected strat
-   [x] Mobile support
-   [x] Persist and display queued strategies
-   [x] Store generatedContent in URL for sharing purposes
-   [x] Prevent past X strategies from being rolled again
-   [x] Way to clear all cached data
-   [x] Way to reset settings to defaults
-   [ ] **WIP** Provide common definitions from consolidated source
    -   (e.g. What are the "large enemies")
-   [ ] **WIP** Display info about the active strategy's tags
-   [ ] Bug reports, feature requests, and strategy submissions
    -   [ ] Enable "Discussions" on repo, and use "Issues" for bugs. Link to them from site with templates and/or a G-Form
-   [ ] Deploy to public location
-   [ ] Higher weight on strategies which have met requirements
    -   (add a est %likelihood for each strat w/ mission requirements, and multiply weight by inverse)
-   [ ] Add strategy hints as revealable "spoilers"
-   [ ] Provide possible ways to determine who does what

## Possible features

-   [ ] Way to see the list of of all strategies
-   [ ] Strat history, count of each played, other stats
    -   [ ] Bias the rolls based on past data
    -   [ ] Tell you which strats are "new" to you
    -   [ ] Tell you which strats are "new" in general
-   [ ] Roll another strategy without clearing the currently displayed one(s)
-   [ ] Localization
-   [ ] Block (and unblock) specific strategies that you don't like
-   [ ] Prevent multiple strategies that conflict with one another (only applicable if multiple strategies can be active at once)

#### Backend-supported features

-   [ ] Like/dislike strategies to globally tweak their weightings
    -   Store total positive, total negative
-   [ ] Provide feedback to increase/decrease a strategy's listed difficulty
    -   Store total votes, and total difficulty points. Divide in UI.
    -   [ ] Select difficulty range for generated strategies
    -   [ ] Mode to continually increase difficulty until a strategy is failed

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
