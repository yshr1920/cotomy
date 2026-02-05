---
title: CotomyElement
sidebar_position: 2
---

# CotomyElement

DOM wrapper with utilities for querying, styling, layout, and events.

**Static Properties**

| Property | Type | Description |
| --- | --- | --- |
| `LISTEN_LAYOUT_EVENTS_ATTRIBUTE` | `string` | Attribute name used to mark elements for layout events. |
| `intersectionObserver` | `IntersectionObserver` | Shared observer that dispatches `inview` and `outview`. |

**Static Methods**

| Method | Description |
| --- | --- |
| `encodeHtml(text)` | Escapes text for safe HTML output. |
| `first(selector, type?)` | Returns the first matching element wrapped as `CotomyElement` (or subtype). |
| `last(selector, type?)` | Returns the last matching element wrapped as `CotomyElement` (or subtype). |
| `find(selector, type?)` | Returns all matching elements wrapped as `CotomyElement` (or subtype). |
| `contains(selector)` | Returns `true` if any element matches the selector. |
| `byId(id, type?)` | Returns an element by id wrapped as `CotomyElement` (or subtype). |
| `containsById(id)` | Returns `true` if an element with the id exists. |
| `empty(type?)` | Creates an empty detached element wrapper. |

**Instance Properties**

| Property | Type | Description |
| --- | --- | --- |
| `instanceId` | `string` | Unique instance id used for event registry. |
| `scopeId` | `string` | Unique scope id for scoped CSS. |
| `stylable` | `boolean` | `true` if the element can receive scoped CSS. |
| `readonly` | `boolean` | Gets or sets read-only state. |
| `id` | `string | null | undefined` | Element id attribute. |
| `element` | `HTMLElement` | Underlying DOM element. |
| `tagname` | `string` | Lowercase tag name. |
| `attached` | `boolean` | `true` if the element is in the document. |
| `value` | `string` | Gets or sets element value. |
| `text` | `string` | Gets or sets `textContent`. |
| `html` | `string` | Gets or sets `innerHTML`. |
| `visible` | `boolean` | `true` if element is visible and measurable. |
| `disabled` | `boolean` | Gets or sets disabled state. |
| `enabled` | `boolean` | Inverse of `disabled`. |
| `width` | `number` | Gets or sets element width (px). |
| `height` | `number` | Gets or sets element height (px). |
| `innerWidth` | `number` | Client width. |
| `innerHeight` | `number` | Client height. |
| `outerWidth` | `number` | Offset width plus horizontal margins. |
| `outerHeight` | `number` | Offset height plus vertical margins. |
| `scrollHeight` | `number` | Scrollable height. |
| `scrollWidth` | `number` | Scrollable width. |
| `scrollTop` | `number` | Scroll top position. |
| `position` | `{ top: number; left: number }` | Position relative to viewport. |
| `absolutePosition` | `{ top: number; left: number }` | Position relative to document. |
| `screenPosition` | `{ top: number; left: number }` | Screen position (viewport coordinates). |
| `rect` | `{ top: number; left: number; width: number; height: number }` | Bounding client rect. |
| `innerRect` | `{ top: number; left: number; width: number; height: number }` | Bounding rect excluding padding. |
| `outerRect` | `{ top: number; left: number; width: number; height: number }` | Bounding rect including margins. |
| `overlapElements` | `CotomyElement[]` | Elements that overlap this element. |
| `padding` | `{ top: number; right: number; bottom: number; left: number }` | Computed padding values. |
| `margin` | `{ top: number; right: number; bottom: number; left: number }` | Computed margin values. |
| `inViewport` | `boolean` | `true` if the element intersects the viewport vertically. |
| `isAboveViewport` | `boolean` | `true` if the element is above the viewport. |
| `isBelowViewport` | `boolean` | `true` if the element is below the viewport. |
| `isLeftViewport` | `boolean` | `true` if the element is left of the viewport. |
| `isRightViewport` | `boolean` | `true` if the element is right of the viewport. |
| `parent` | `CotomyElement` | Parent element wrapper. |
| `parents` | `CotomyElement[]` | All ancestor elements. |

**Instance Methods**

| Method | Description |
| --- | --- |
| `listenLayoutEvents()` | Marks this element to receive layout events. |
| `generateId(prefix?)` | Assigns a unique id if missing. |
| `clone(type?)` | Clones the element and strips Cotomy attributes. |
| `is(selector)` | Checks selector match including ancestor context. |
| `match(selector)` | Checks `element.matches` safely. |
| `setFocus()` | Focuses the element. |
| `remove()` | Removes the element from DOM. |
| `clear()` | Removes children and clears text. |
| `overlaps(target)` | Returns `true` if this element overlaps the target. |
| `scrollIn(options?)` | Scrolls this element into view. |
| `scrollTo(target, options?)` | Scrolls a target element into view. |
| `comesBefore(target)` | Returns `true` if this element precedes the target in DOM. |
| `comesAfter(target)` | Returns `true` if this element follows the target in DOM. |
| `hasAttribute(name)` | Checks for an attribute. |
| `attribute(name, value?)` | Gets/sets/removes an attribute. |
| `hasClass(name)` | Checks for a class. |
| `addClass(name)` | Adds a class. |
| `removeClass(name)` | Removes a class. |
| `toggleClass(name, force?)` | Toggles a class. |
| `style(name, value?)` | Gets or sets an inline style. |
| `computedStyle(name)` | Returns the computed style value for a property. |
| `closest(selector, type?)` | Finds the closest ancestor matching selector. |
| `hasChildren(selector?)` | Returns `true` if matching children exist. |
| `children(selector?, type?)` | Returns child elements. |
| `firstChild(selector?, type?)` | Returns the first matching child. |
| `lastChild(selector?, type?)` | Returns the last matching child. |
| `previousSibling(selector?, type?)` | Returns the previous matching sibling. |
| `nextSibling(selector?, type?)` | Returns the next matching sibling. |
| `siblings(selector?, type?)` | Returns matching siblings. |
| `prepend(element)` | Prepends a child element. |
| `append(element)` | Appends a child element. |
| `appendAll(elements)` | Appends multiple children. |
| `insertBefore(target)` | Inserts this element before a target. |
| `insertAfter(target)` | Inserts this element after a target. |
| `appendTo(target)` | Appends this element to a target. |
| `prependTo(target)` | Prepends this element to a target. |
| `trigger(event, e?)` | Dispatches an event from this element. |
| `on(event, handle, options?)` | Registers an event handler. |
| `onSubTree(selector, event, handle)` | Registers a delegated handler. |
| `once(event, handle, options?)` | Registers a one-time handler. |
| `off(event, handle?)` | Removes handlers. |
| `click(handle?)` | Registers or triggers `click`. |
| `dblclick(handle?)` | Registers or triggers `dblclick`. |
| `mouseover(handle?)` | Registers or triggers `mouseover`. |
| `mouseout(handle?)` | Registers or triggers `mouseout`. |
| `mousedown(handle?)` | Registers or triggers `mousedown`. |
| `mouseup(handle?)` | Registers or triggers `mouseup`. |
| `mousemove(handle?)` | Registers or triggers `mousemove`. |
| `mouseenter(handle?)` | Registers or triggers `mouseenter`. |
| `mouseleave(handle?)` | Registers or triggers `mouseleave`. |
| `dragstart(handle?)` | Registers or triggers `dragstart`. |
| `dragend(handle?)` | Registers or triggers `dragend`. |
| `dragover(handle?)` | Registers or triggers `dragover`. |
| `dragenter(handle?)` | Registers or triggers `dragenter`. |
| `dragleave(handle?)` | Registers or triggers `dragleave`. |
| `drop(handle?)` | Registers or triggers `drop`. |
| `drag(handle?)` | Registers or triggers `drag`. |
| `removed(handle?)` | Registers or triggers `removed`. |
| `keydown(handle?)` | Registers or triggers `keydown`. |
| `keyup(handle?)` | Registers or triggers `keyup`. |
| `keypress(handle?)` | Registers or triggers `keypress`. |
| `change(handle?)` | Registers or triggers `change`. |
| `input(handle?)` | Registers or triggers `input`. |
| `inview(handle?)` | Fires when element enters the viewport. |
| `outview(handle?)` | Fires when element leaves the viewport. |
| `focus(handle?)` | Registers or triggers `focus`. |
| `blur(handle?)` | Registers or triggers `blur`. |
| `focusin(handle?)` | Registers or triggers `focusin`. |
| `focusout(handle?)` | Registers or triggers `focusout`. |
| `filedrop(handle)` | Handles file drop and returns `File[]`. |
| `resize(handle?)` | Registers or triggers layout resize events. |
| `scroll(handle?)` | Registers or triggers layout scroll events. |
| `changeLayout(handle?)` | Registers or triggers layout change events. |
