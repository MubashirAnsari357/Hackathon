import { FlatList, RefreshControl, Text, View } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'


const Product = ({products, refreshing, onRefresh}) => {

    const listHeader = () => {
        return <View className="px-3 justify-center">
            <Text className="text-base text-gray-600 font-semibold">{products.length} Products</Text>
        </View>
    }
    return (
        <FlatList vertical
            contentContainerStyle={{
                paddingRight: 20,
                paddingTop: 17,
                paddingBottom: 150
            }}
            numColumns={2}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={products}
            renderItem={({ item }) => (
                <ProductCard product={item} />
            )}
            keyExtractor={(item) => item.pid}
            ListHeaderComponent={listHeader}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default Product