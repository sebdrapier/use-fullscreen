# useFullscreen Hook

A custom React hook to manage fullscreen mode for any element, with vendor-prefixed support for broad browser compatibility.

## Features

- **Easy Integration:** Provides a ref to attach to any element.
- **Fullscreen Control:** Offers functions to enter, exit, and toggle fullscreen mode.
- **Cross-Browser Compatibility:** Supports vendor-prefixed implementations (e.g., `webkit`, `moz`, `ms`).
- **Reactive State:** Automatically updates the fullscreen status.

## Installation

Since this is a standalone hook, simply copy the `useFullscreen.ts` file into your project. If you're using a module bundler or a framework like [Bun](https://bun.sh/docs/getting-started) or Create React App, you can import and use the hook directly.

## Usage

1. **Import the Hook:**

   ```tsx
   import { useFullscreen } from "./useFullscreen";
   ```

2. **Attach it to a Component:**

   Here's an example component demonstrating its usage:

   ```tsx
   import React from "react";
   import { useFullscreen } from "./useFullscreen";

   const FullscreenComponent: React.FC = () => {
     const { elementRef, isFullscreen, toggleFullscreen } = useFullscreen<HTMLDivElement>();

     return (
       <div>
         <div
           ref={elementRef}
           style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "10px" }}
         >
           <h1>Fullscreen Demo</h1>
           <p>{isFullscreen ? "Currently in fullscreen mode." : "Not in fullscreen mode."}</p>
         </div>
         <button onClick={toggleFullscreen}>
           {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
         </button>
       </div>
     );
   };

   export default FullscreenComponent;
   ```

## API Reference

### `useFullscreen<T extends HTMLElement = HTMLElement>()`

Returns an object containing:

- **`elementRef`**: `React.RefObject<T>`
  A ref to be attached to the element you wish to control fullscreen for.

- **`isFullscreen`**: `boolean`
  Indicates whether the element is currently in fullscreen mode.

- **`enterFullscreen`**: `() => void`
  Function to request fullscreen mode for the referenced element.

- **`exitFullscreen`**: `() => void`
  Function to exit fullscreen mode.

- **`toggleFullscreen`**: `() => void`
  Function to toggle between entering and exiting fullscreen mode.

## Example Code

Below is the complete code for the hook with detailed JSDoc comments:

```tsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to manage fullscreen mode for a given element.
 *
 * This hook provides a ref for the target element along with methods to
 * enter, exit, and toggle fullscreen mode. It also supports vendor-prefixed
 * fullscreen implementations for broader browser compatibility.
 *
 * @template T - The type of the element (defaults to HTMLElement).
 * @returns {Object} An object containing:
 *   - `elementRef`: Ref to attach to the element.
 *   - `isFullscreen`: Boolean indicating if the element is in fullscreen mode.
 *   - `enterFullscreen`: Function to request fullscreen mode.
 *   - `exitFullscreen`: Function to exit fullscreen mode.
 *   - `toggleFullscreen`: Function to toggle fullscreen mode.
 */
export function useFullscreen<T extends HTMLElement = HTMLElement>(): object {
  const elementRef = useRef<T>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Retrieves the current fullscreen element, accounting for vendor prefixes.
   *
   * @returns {Element | null} The current fullscreen element or null if none.
   */
  function getFullscreenElement(): Element | null {
    return (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      null
    );
  }

  /**
   * Event handler for fullscreen change events.
   * Updates the `isFullscreen` state based on the current fullscreen element.
   */
  const handleFullscreenChange = useCallback(() => {
    const fullscreenElement = getFullscreenElement();
    setIsFullscreen(fullscreenElement === elementRef.current);
  }, []);

  useEffect(() => {
    // Register vendor-specific fullscreen change events.
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  /**
   * Requests fullscreen mode for the referenced element.
   */
  const enterFullscreen = useCallback(() => {
    const element = elementRef.current;
    if (element && !isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    }
  }, [isFullscreen]);

  /**
   * Exits fullscreen mode.
   */
  const exitFullscreen = useCallback(() => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  /**
   * Toggles between entering and exiting fullscreen mode.
   */
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    elementRef,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
```

## License

This project is licensed under the [MIT License](LICENSE).
