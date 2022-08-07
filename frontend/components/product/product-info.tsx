import { compareObjectProps } from "hooks/useDeepMemo";
import { memo } from "react";
import { ProductType } from "types";
import Features from "./product-info-features";
import Models from "./product-info-models";
import Header from "./product-info-header";
import Kicker from "./product-info-kicker";
import ProductPrice from "./product-info-price";
import Action from "./product-info-action";

const ProductInfo: React.FC<{ product: ProductType }> = ({ product }) => {
  const prices = Object.freeze({
    price: product.price,
    formattedPrice: product.formattedPrice,
    oldPrice: product.oldPrice,
    formattedOldPrice: product.formattedOldPrice,
    interestFree: product.interestFree,
    formattedInterestFree: product.formattedInterestFree,
  });
  return (
    <div className="m-4 lg:px-12">
      <Header product={product} />
      <Kicker kickers={{ sale: product.sale, new: product.new }} />
      <ProductPrice prices={prices} />
      {product.features && <Features features={product.features} />}
      {product.models && <Models models={product.models} />}
      <Action />
    </div>
  );
};

export default memo(ProductInfo, compareObjectProps);