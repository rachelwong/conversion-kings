if (!customElements.get("product-carousel-wrapper")) {
  customElements.define(
    "product-carousel-wrapper",
    class ProductMediaGallery extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.$slider = $(this).find(".product__image-slider");
        this.$thumbnails = $(this).find(".product__image-thumbnail");

        this.initSlider();
        if (this.$thumbnails.length) this.initThumbnails();
      }

      disconnectedCallback() {
        [this.$slider, this.$thumbnails].forEach(($el) => {
          if ($el && $el.hasClass("slick-initialized")) $el.slick("unslick");
        });
      }

      // asNavFor gets the elements rather than a class selector so that several
      // galleries on one page don't control each other
      initSlider() {
        if (this.$slider.hasClass("slick-initialized")) return;

        this.$slider.slick({
          rows: 0,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          arrows: true,
          dots: false,
          // adaptiveHeight: true,
          asNavFor: this.$thumbnails.length ? this.$thumbnails : null,
        });
      }

      initThumbnails() {
        if (this.$thumbnails.hasClass("slick-initialized")) return;

        this.$thumbnails.slick({
          slidesToShow: 6,
          slidesToScroll: 1,
          vertical: true,
          verticalSwiping: true,
          infinite: false,
          arrows: false,
          dots: false,
          focusOnSelect: true,
          asNavFor: this.$slider,
          responsive: [
            {
              breakpoint: 750,
              settings: {
                slidesToShow: 4,
                vertical: false,
                verticalSwiping: false,
              },
            },
          ],
        });
      }
    },
  );
}
