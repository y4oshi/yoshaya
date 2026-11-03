// # Product names are stored in an array; positions run from 0 to 5.
var names = ["Pentel ENERGEL 0.7 Navy Blue Pen", "Tri-Mate Ball Pen - Blue (12 pack)", "STAEDTLER 12 Noris Pencils", "Pentel Maxiflo Whiteboard Markers (4 pieces)", "Oxford Spiral Cover Notebook A4 (60 sheets)", "Register Book F/S 3QR"];
// # Store prices as whole fils to avoid decimal errors during addition.
var prices = [450, 750, 1350, 1650, 850, 1500];
// # Each position holds the quantity of the matching product in the cart.
var quantities = [0, 0, 0, 0, 0, 0];
var coupon = ""; // # An empty string means no coupon is selected.
var subtotal = 0; // # Holds the total price before discount, in fils.
var discount = 0; // # Holds the discount, in fils.
var total = 0; // # Holds the final total, in fils.
var orderNumber = 0; // # Counts demo orders during this page visit.

function money(fils) { // # A reusable function converts fils into a KD display string.
    return "KD " + (fils / 1000).toFixed(3); // # Divide by 1000 and display three decimal places.
} // # Ends the money function.

function addItem(i) { // # The parameter i identifies the selected product.
    if (quantities[i] >= 99) { // # Prevents unreasonable quantities for this demonstration.
        notify("Maximum 99 packs per product."); // # Displays the limit message.
        return; // # Stops this function without adding another pack.
    } // # Ends the quantity-limit check.
    quantities[i] = quantities[i] + 1; // # Adds one pack to this product quantity.
    notify("Added to bag: " + names[i]); // # Confirms what was added.
    renderCart(); // # Rebuilds the displayed cart and recalculates totals.
} // # Ends the add function.

function decreaseItem(i) { // # Removes one pack of the selected product.
    if (quantities[i] > 0) { // # Only subtracts when at least one pack exists.
        quantities[i] = quantities[i] - 1; // # Decreases the quantity by one.
    } // # Ends the positive-quantity check.
    renderCart(); // # Updates the cart; zero-quantity products disappear.
} // # Ends the decrease function.

function removeItem(i) { // # Removes all packs of one product.
    quantities[i] = 0; // # Sets the selected product quantity to zero.
    renderCart(); // # Updates the displayed cart and totals.
} // # Ends the remove function.

function renderCart() { // # Draws the basket from the quantity array.
    document.getElementById("receipt").innerHTML = ""; // # Clears an earlier summary after cart or coupon changes.
    subtotal = 0; // # Resets the subtotal before calculating it again.
    var count = 0; // # Starts the total pack count at zero.
    var rows = ""; // # Starts an empty string for the table rows.
    for (var i = 0; i < names.length; i++) { // # Visits each product in order.
        if (quantities[i] > 0) { // # Includes only products currently in the basket.
            var lineTotal = quantities[i] * prices[i]; // # Calculates this product's line total in fils.
            subtotal = subtotal + lineTotal; // # Adds this line to the subtotal.
            count = count + quantities[i]; // # Adds this line's number of packs to the badge count.
            rows = rows + "<div class='bag-item'><img src='product-" + i + ".jpg' alt=''><div><h3>" + names[i] + "</h3><span>" + money(lineTotal) + "</span>"; // # Adds the product photograph, name and line total.
            rows = rows + "<div class='bag-actions'><button aria-label='Decrease " + names[i] + "' onclick='decreaseItem(" + i + ")'>−</button><span>" + quantities[i] + "</span><button aria-label='Increase " + names[i] + "' onclick='addItem(" + i + ")'>+</button><button onclick='removeItem(" + i + ")'>Remove</button></div></div></div>"; // # Adds accessible quantity buttons and closes the product row.
        } // # Ends the nonempty-product check.
    } // # Ends the product loop.
    if (count == 0) { // # Checks whether the entire cart is empty.
        document.getElementById("cartArea").innerHTML = "<p align='center'>Your bag is waiting for a bright idea. Explore the collection to get started.</p>"; // # Shows an empty-cart message.
        coupon = ""; // # Clears any coupon when there are no products.
    } else { // # Runs when at least one product is present.
        document.getElementById("cartArea").innerHTML = rows; // # Displays the completed list of bag items.
    } // # Ends the empty-cart decision.
    discount = 0; // # Starts with no discount on each recalculation.
    var message = "No coupon applied."; // # Sets the default coupon message.
    if (coupon == "SCHOOL10") { // # Checks for the percentage coupon.
        discount = Math.round(subtotal * 10 / 100); // # Calculates 10 percent and rounds to the nearest whole fils.
        message = "SCHOOL10 applied: 10% off (rounded to the nearest fils)."; // # Explains the active discount.
    } else if (coupon == "SAVE250") { // # Checks for the fixed discount coupon.
        if (subtotal >= 3000) { // # Requires at least KD 3.000 before discount.
            discount = 250; // # Gives a fixed discount of 250 fils.
            message = "SAVE250 applied: 250 fils off."; // # Confirms eligibility.
        } else { // # Handles a basket that has dropped below the minimum.
            message = "SAVE250 selected: spend " + money(3000 - subtotal) + " more to activate it."; // # Explains the amount still needed.
        } // # Ends the minimum-spend decision.
    } // # Ends the coupon decision.
    total = subtotal - discount; // # Calculates the final amount after discount.
    document.getElementById("cartCount").textContent = count; // # Updates the cart quantity in the navigation.
    document.getElementById("subtotal").textContent = money(subtotal); // # Displays the subtotal.
    document.getElementById("discount").textContent = money(discount); // # Displays the discount.
    document.getElementById("total").textContent = money(total); // # Displays the final amount.
    document.getElementById("couponMessage").textContent = message; // # Displays the current coupon status.
} // # Ends the cart-rendering function.

function applyCoupon() { // # Reads and validates the entered coupon.
    var code = document.getElementById("couponInput").value.trim().toUpperCase(); // # Removes outer spaces and converts the input to uppercase.
    if (subtotal == 0) { // # Requires something in the cart first.
        document.getElementById("couponMessage").textContent = "Add a product before applying a coupon."; // # Explains why the coupon cannot be applied.
        return; // # Stops processing this coupon.
    } // # Ends the empty-cart check.
    if (code == "SCHOOL10" || code == "SAVE250") { // # Accepts either of the two exact known codes.
        coupon = code; // # Replaces the previous coupon rather than stacking discounts.
        renderCart(); // # Recalculates totals using the selected coupon.
    } else { // # Handles an empty or unknown coupon code.
        document.getElementById("couponMessage").textContent = "Unknown code. Try SCHOOL10 or SAVE250. Existing discount is unchanged."; // # Gives feedback without inserting the user's input as HTML.
    } // # Ends the coupon validation.
} // # Ends the apply-coupon function.

function removeCoupon() { // # Removes an applied coupon without changing products.
    coupon = ""; // # Clears the active coupon.
    document.getElementById("couponInput").value = ""; // # Clears the text field.
    renderCart(); // # Recalculates the undiscounted total.
} // # Ends the remove-coupon function.

function clearCart() { // # Empties the entire basket.
    for (var i = 0; i < quantities.length; i++) { // # Visits every product quantity.
        quantities[i] = 0; // # Removes all packs of this product.
    } // # Ends the clearing loop.
    coupon = ""; // # Removes the selected coupon.
    document.getElementById("couponInput").value = ""; // # Clears the coupon entry field.
    renderCart(); // # Updates the empty cart and zero totals.
} // # Ends the clear-cart function.

function checkout() { // # Creates an on-page demonstration receipt, without sending any data.
    if (subtotal == 0) { // # Prevents placing an empty order.
        notify("Your bag is empty. Add an essential first."); // # Shows why checkout did not proceed.
        document.getElementById("couponMessage").textContent = "Add products before creating an order summary."; // # Also shows the message beside checkout.
        return; // # Stops the checkout function.
    } // # Ends the empty-order check.
    orderNumber = orderNumber + 1; // # Gives this page visit's next demonstration order a number.
    var receipt = "<h2 align='center'>Order summary " + orderNumber + "</h2><ul>"; // # Starts the receipt heading and item list.
    for (var i = 0; i < names.length; i++) { // # Visits every product to assemble the receipt.
        if (quantities[i] > 0) { // # Includes only ordered products.
            receipt = receipt + "<li>" + names[i] + " x " + quantities[i] + " = " + money(prices[i] * quantities[i]) + "</li>"; // # Adds a product, quantity and line total.
        } // # Ends the ordered-product check.
    } // # Ends the receipt loop.
    receipt = receipt + "</ul><p align='center'>Subtotal: " + money(subtotal) + " | Discount: " + money(discount) + " | Coupon: " + (coupon || "None") + "</p>"; // # Shows the receipt calculation; an empty coupon displays None.
    receipt = receipt + "<h3 align='center'>Total: " + money(total) + "</h3><p align='center'>Your summary is ready. No payment has been taken and no order has been submitted.</p>"; // # Shows the final amount and the demonstration notice.
    document.getElementById("receipt").innerHTML = receipt; // # Displays the receipt built only from fixed product data and numbers.
    // # Keep the bag intact: generating a summary does not place an order.
    document.getElementById("receipt").scrollIntoView({block: "nearest"}); // # Confirms completion.
} // # Ends the checkout function.



var category = "All"; // # Remembers the selected product category.
var toastTimer; // # Remembers the current message timeout.
function notify(message) { // # Shows short feedback without opening the cart.
    var box = document.getElementById("shopMessage"); // # Finds the message container.
    box.textContent = message; // # Inserts feedback safely as plain text.
    box.hidden = false; // # Makes the message visible.
    clearTimeout(toastTimer); // # Cancels any earlier hide timer.
    toastTimer = setTimeout(function() { box.hidden = true; }, 3500); // # Hides the message after 3.5 seconds.
} // # Ends the feedback function.
function openCart() { // # Runs only from the Bag button.
    document.getElementById("cartPanel").showModal(); // # Opens the native dialog and traps keyboard focus inside.
} // # Ends the opening function.
function closeCart() { // # Runs from the close button; Escape also works natively.
    document.getElementById("cartPanel").close(); // # Closes the dialog and restores focus.
} // # Ends the closing function.
function filterCategory(name, button) { // # Changes the active category and its visual state.
    category = name; // # Saves the category selection.
    var buttons = document.querySelectorAll(".filter"); // # Gets all category buttons.
    for (var i = 0; i < buttons.length; i++) { // # Visits each category button.
        buttons[i].setAttribute("aria-pressed", "false"); // # Marks the button as unselected.
    } // # Ends the button loop.
    button.setAttribute("aria-pressed", "true"); // # Marks the clicked category as selected.
    filterProducts(); // # Updates the visible product cards.
} // # Ends category selection.
function filterProducts() { // # Combines category selection with the search text.
    var search = document.getElementById("search").value.trim().toLowerCase(); // # Reads and normalises the search query.
    var cards = document.querySelectorAll(".product"); // # Gets all product cards.
    var found = 0; // # Starts the visible-product counter.
    for (var i = 0; i < cards.length; i++) { // # Visits each card.
        var matchesCategory = category == "All" || cards[i].dataset.category == category; // # Checks the category.
        var matchesSearch = cards[i].dataset.search.toLowerCase().includes(search); // # Checks whether the product text contains the query.
        cards[i].hidden = !(matchesCategory && matchesSearch); // # Hides cards that fail either condition.
        if (!cards[i].hidden) { found = found + 1; } // # Counts cards still visible.
    } // # Ends the card loop.
    document.getElementById("noResults").hidden = found > 0; // # Shows the empty-results message only when needed.
    document.getElementById("resultCount").textContent = found + (found == 1 ? " essential" : " essentials"); // # Updates the result count.
} // # Ends product filtering.
renderCart(); // # Initialises the closed, empty bag when the page loads.
