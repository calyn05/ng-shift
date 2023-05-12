export function canDeactivate(component: any): boolean {
  if (component.canExit() === true) {
    return true;
  } else {
    return confirm(
      'You have form changes! If you leave, your data will be lost.'
    );
  }
}
