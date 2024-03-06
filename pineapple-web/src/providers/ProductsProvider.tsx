import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback, useState } from "react";
import {
  addStoreItem,
  getStoreItems,
  removeStoreItem,
  updateStoreItem,
} from "~/apiEndpoints";
import type { ItemProps, MenuItem } from "~/types";
import useStore from "~/hooks/useStore";

interface ProductsContextType {
  isLoading: boolean;
  error: unknown;
  products: MenuItem[];
  addProduct: (product: ItemProps) => void;
  removeProduct: (product: ItemProps) => void;
  updateProduct: (updatedProduct: ItemProps) => void;
}

// Define the context
export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

function ProductsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { store } = useStore();

  const {
    isLoading,
    error,
    data: products,
  } = useQuery({
    queryKey: ["products", store?.id],
    queryFn: () => {
      // Ensure store.id is not undefined before calling getStoreItems
      if (store?.id) {
        return getStoreItems(store.id); // store.id is now guaranteed to be a string
      }
      throw new Error("Store ID is undefined");
    },
    enabled: !!store?.id,
  });

  const addProduct = useCallback(
    async (product: ItemProps) => {
      console.log("This is the add product", store?.id, product, product.name);
      try {
        if (!store) {
          console.error("Store is undefined.");
          return; // or throw new Error("Store is undefined.");
        }
        const resp = await addStoreItem(store.id, product);
        console.log("trying to add yo - sent to AddStoreItem");
        if (resp) {
          await queryClient.invalidateQueries({
            queryKey: ["products", store.id],
          });
        }

        return resp;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        if (!store) {
          console.error("Store is undefined.");
          return; // or throw new Error("Store is undefined.");
        }
        await queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  const removeProduct = useCallback(
    async (product: ItemProps) => {
      try {
        if (!store) {
          console.error("Store is undefined.");
          return; // or throw new Error("Store is undefined.");
        }
        if (product.id === undefined) {
          console.error("Product ID is undefined.");
          return; // Optionally, you can throw an error here
        }
        await removeStoreItem(store.id, product.id).then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["products", store.id],
          });
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (!store) {
          console.error("Store is undefined.");
          return; // or throw new Error("Store is undefined.");
        }
        await queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  const updateProduct = useCallback(
    async (updatedProduct: ItemProps) => {
      try {
        console.log(
          "them details",
          store?.id,
          updatedProduct.id,
          updatedProduct,
        );
        if (!store) {
          console.error("Store is undefined.");
          return; // or throw new Error("Store is undefined.");
        }
        if (updatedProduct.id === undefined) {
          console.error("Product ID is undefined.");
          return; // Optionally, you can throw an error here
        }
        const resp = await updateStoreItem(
          store.id,
          updatedProduct.id,
          updatedProduct,
        );
        if (resp) {
          await queryClient.invalidateQueries({
            queryKey: ["products", store.id],
          });
        }

        return resp;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        if (!store) {
          console.error("Store is undefined.");
          return; // or throw new Error("Store is undefined.");
        }
        await queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  const value = {
    isLoading,
    error,
    products,
    addProduct,
    removeProduct,
    updateProduct,
  };

  return (
    <ProductsContext.Provider value={value as ProductsContextType}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
