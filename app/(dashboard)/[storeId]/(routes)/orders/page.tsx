import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";




const OrdersPage = async({ params }: { params: { storeId: string }}) => {

  const orders = await prismadb.order.findMany({ // Cada order contendrá -> orderItems: orderItem[] -> product
    where: {
      storeId: params.storeId
    },
    include:{
      orderItems:{
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* billboards -> client -> dataTable -> se basa en column y cell-action */}
            <OrderClient data={formattedOrders}/>
        </div>
    </div>
  )
}

export default OrdersPage;