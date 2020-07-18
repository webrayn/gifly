"use strict";

function adjustBodyPadding() {
  // if html has a vertical scrollbar, padding-right should be adjusted on the body to avoid unsightly gap
  if (
    document.documentElement.scrollHeight >
    document.documentElement.clientHeight
  ) {
    document.body.classList.add("scroll");
  } else {
    document.body.classList.remove("scroll");
  }
}

function addNewColor(URL) {
  this.tabURLs[URL].color = `hsl(${this.hue}, 100%, ${this.lightness}%)`;
  // change hue or lightness to create a new color for the next duplicate
  if (this.hue <= 280) {
    this.hue += 40;
  } else if (this.lightness == 70) {
    this.hue = 0;
    this.lightness = 40;
  }
}

module.exports = {
  adjustBodyPadding,
  addNewColor
};
