/**
 * @internal
 * The template of all YCloud icon components.
 */
export const ycloudIconTemplate = `@if (title(); as titleValue) {
  <title>{{ titleValue }}</title>
}
<ng-content select="title"></ng-content>
<ng-container #contentRef></ng-container>
<ng-content />`;
