const blockerContainer = document.body;
const blocker = document.createElement('div');
blocker.style.position = 'fixed';
blocker.style.top = '0px';
blocker.style.left = '0px';
blocker.style.width = '100%';
blocker.style.height = '100%';
blocker.style.backgroundColor = 'white';
blocker.style.opacity = '0.25';
blocker.style.zIndex = '1000000';
blocker.style.cursor = 'progress';

export class UIBlocker {

  static blockers = 0;

  static enable() {
    UIBlocker.blockers--;
    if (UIBlocker.blockers === 0) blockerContainer.removeChild(blocker);
  }

  static disable() {
    if (UIBlocker.blockers === 0) blockerContainer.appendChild(blocker);
    UIBlocker.blockers++;
  }
}