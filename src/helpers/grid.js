/**
 * maxim tyminko 02.11.17.
 * maximtyminko.com
 */

export default {
  data() {
    return {
      placeholderClass: "grid-cell-placeholder",
      gridContainer: null,
      cellPlaceholders: null,
      gridCells: [],
      gridCellStyle: null
    };
  },
  methods: {
    /**
     * @param {string} gridClass
     */
    setGridElements(gridClass) {
      this.gridContainer = document.getElementsByClassName(gridClass)[0];
      if (!this.gridContainer) {
        this.gridCells = [];
        return;
      }
      this.gridCells = this.gridContainer.children;
    },

    removePlaceholdersFromGrid(numToKeep) {
      if (!this.cellPlaceholders) {
        this.cellPlaceholders = document.getElementsByClassName(
          this.placeholderClass
        );
      }
      const numToRemove = this.cellPlaceholders.length - numToKeep;
      if (numToRemove < 1) {
        return Math.abs(numToRemove);
      }
      for (let i = numToRemove - 1; i >= 0; i--) {
        const el = this.cellPlaceholders[i];
        el.parentNode.removeChild(el);
      }
      return 0;
    },

    addPlaceholdersToGrid(numToAdd) {
      if (numToAdd) {
        if (!this.gridContainer) {
          this.gridContainer = document.getElementById("main-grid");
          if (!this.gridContainer) {
            return;
          }
        }
        for (let i = 0; i < numToAdd; i++) {
          let placeholder = document.createElement("div");
          placeholder.className = this.placeholderClass;
          this.gridContainer.appendChild(placeholder);
        }
      }
    },
    /**
     * @param {string=} gridClass
     */
    fillEmptySpaceInGrid(gridClass) {
      if (typeof gridClass === "string") {
        this.setGridElements(gridClass);
      }
      if (!this.gridCells.length) {
        return;
      }
      if (!this.gridCellStyle) {
        this.gridCellStyle = getComputedStyle(this.gridCells[0], null);
      }

      const cellW = parseFloat(this.gridCellStyle.getPropertyValue("width"));
      const winW = window.innerWidth;
      const numArtworks = this.gridCells.length;

      const numItemsInRow = Math.round(winW / cellW);

      const numRows = numArtworks / numItemsInRow;
      const numHangingItems = (numRows - Math.floor(numRows)) * numItemsInRow;
      let numToAdd = numHangingItems > 0 ? numItemsInRow - numHangingItems : 0;

      numToAdd = this.removePlaceholdersFromGrid(numToAdd);
      this.addPlaceholdersToGrid(numToAdd);
    }
  },

  mounted: function() {
    window.addEventListener("resize", this.fillEmptySpaceInGrid);
  }
};
