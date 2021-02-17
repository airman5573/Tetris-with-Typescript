class Key {
  btnNode: HTMLDivElement;
  constructor(btnFeatureClassName: string) {
    this.btnNode = document.querySelector(`.button-container.feature-${btnFeatureClassName}`);
  }
  ativeButton = () => {
    if (!this.btnNode.classList.contains('active')) this.btnNode.classList.add('active');
  }
  inactiveButton = () => {
    if (this.btnNode.classList.contains('active')) this.btnNode.classList.remove('active');
  }
}

export default Key;