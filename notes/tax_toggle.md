# Tax Toggle & Final Price

## What was added

The "Display total after taxes" toggle now changes the listing price shown to the user.

### Toggle OFF

The original listing price is displayed:

> ₹1000/night

### Toggle ON

The final price including 18% GST is displayed:

> ₹1180/night

The calculation is:

`Final Price = Base Price × 1.18`

The base price and tax-inclusive price are maintained separately in the listing card, and JavaScript switches between them when the checkbox changes.

## Files modified

- `views/listings/index.ejs`

## Testing completed

The following were tested locally:

- Toggle OFF displays the original price.
- Toggle ON displays the price including 18% GST.
- Switching OFF again restores the original price.
- The calculation correctly applies 18% GST.

## Interview explanation

> "I implemented a tax display toggle where the user can switch between the base listing price and the final price including 18% GST. The UI updates dynamically using JavaScript without reloading the page."
