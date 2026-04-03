import type { Schema, Struct } from '@strapi/strapi';

export interface WishlistItem extends Struct.ComponentSchema {
  collectionName: 'components_wishlist_items';
  info: {
    displayName: 'item';
  };
  attributes: {
    image: Schema.Attribute.Text;
    price: Schema.Attribute.Decimal;
    title: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'wishlist.item': WishlistItem;
    }
  }
}
