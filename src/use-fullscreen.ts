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
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
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
