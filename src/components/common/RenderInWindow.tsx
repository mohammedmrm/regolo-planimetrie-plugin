import { createPopup } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
export const RenderInWindow = ({
  open,
  setOpen,
  children,
  returnWindow,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
  returnWindow: (w: Window | null) => void;
}) => {
  const _window = useRef<Window | null>(null);
  const [ready, setReady] = useState(false);
  const preparePopup = async () => {
    let curWindow: Window;

    if (open) {
      // get screen details on chrome browser
      // read here https://developer.chrome.com/docs/capabilities/web-apis/window-management
      if ('getScreenDetails' in window) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const screenDetails = await window.getScreenDetails();
        const currentScreen = screenDetails.currentScreen;
        _window.current = createPopup(screen.width, screen.height, screen.width, screen.height);
        _window.current?.moveTo(currentScreen.isPrimary ? currentScreen.width : 0, 0);
      } else if ('getScreens' in window) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const screenDetails = await window.getScreens();
        const currentScreen = screenDetails.currentScreen;
        _window.current = createPopup(screen.width, screen.height, screen.width, screen.height);
        _window.current?.moveTo(currentScreen.isPrimary ? currentScreen.width * 2 : 0, 0);
        console.log(screenDetails);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        _window.current = createPopup(screen.left > 0 ? 0 : screen.width, 0, screen.width, screen.height);
        console.log(screen);
        console.log(window);
      }

      if (_window.current) {
        // Save reference to window for cleanup
        curWindow = _window.current;
        returnWindow(curWindow);
        curWindow.onbeforeunload = () => {
          setReady(false);
          setOpen(false);
        };

        // Delay rendering until styles are ready
        copyStyles(window.document, _window.current.document);
        await new Promise((r) => setTimeout(r, 500)); // Adjust the delay as needed
        setReady(true);
      } else {
        console.log('window not ready');
      }
    } else {
      if (_window.current) {
        _window.current.close();
        //returnWindow(null)
      }
      setReady(false);
    }
  };
  useEffect(() => {
    // If open, create window and store in ref
    preparePopup();
    return () => {
      returnWindow(_window.current);
    };
  }, [open]);

  if (!_window.current) return <></>;
  if (open && ready) return createPortal(<>{children}</>, _window.current.document.body, 'x');
  return <></>;
};
function copyStyles(src: Document, dest: Document) {
  const parentHead = window.document.querySelector('head')?.childNodes || undefined;
  parentHead?.forEach((item) => {
    dest.head.appendChild(item.cloneNode(true)); // deep copy
  });
  Array.from(src.styleSheets).forEach((styleSheet) => {
    styleSheet.ownerNode && dest.head.appendChild(styleSheet.ownerNode.cloneNode(true));
  });
  Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
}
