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
-   [ ] **WIP** Make the UI prettier
    -   [x] DRG themed
    -   [x] Background images
    -   [x] Favicon
    -   [ ] Clean display of selected strat
-   [ ] Roll another strategy without clearing the currently displayed one(s)
-   [ ] Persist queued strategies
-   [ ] Bug reports, feature requests, and strategy submissions
-   [ ] Higher weight on strategies which have met requirements
    -   (add a est %likelihood for each strat w/ mission requirements, and multiply weight by inverse)
-   [ ] Provide common definitions from consolidated source
    -   (e.g. What are the "large enemies")
-   [ ] Add strategy hints as revealable "spoilers"
-   [ ] Strat history, count of each played, other stats
    -   [ ] Bias the rolls based on past data
    -   [ ] Tell you which strats are "new" to you
    -   [ ] Tell you which strats are "new" in general
-   [ ] Block (and unblock) specific strategies that you don't like
-   [ ] Way to see the list of of all strategies
-   [ ] Full mobile support (compress team inputs, or wrap below tags)
-   [ ] Way to clear all cached data?
-   [ ] Way to reset settings to defaults?
-   [ ] Provide possible ways to determine who does what
-   [ ] Mark strategies as successfully completed or failed.
    -   [ ] Some surprise if every strat is succeeded.
-   [ ] Prevent multiple strategies that conflict with one another (how?)

## Backend features

-   [ ] Like/dislike strategies to globally tweak their weightings
    -   Store total positive, total negative
-   [ ] Provide feedback to increase/decrease a strategy's listed difficulty
    -   Store total votes, and total difficulty points. Divide in UI.
    -   [ ] Select difficulty range for generated strategies
    -   [ ] Mode to continually increase difficulty until a strategy is failed
-   [ ] Shared sessions (stretch)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
