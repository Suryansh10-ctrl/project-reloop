'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { orders as placeholderOrders, Order } from '@/lib/placeholder-data';
import { useUser } from '@/firebase';
import { Package, Frown, Loader2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function MyOrdersPage() {
  const { user, isUserLoading } = useUser();
  const [orders, setOrders] = useState(placeholderOrders);

  useEffect(() => {
    // Check for new order data in sessionStorage
    const newOrderJSON = sessionStorage.getItem('newOrder');
    
    if (newOrderJSON && user) {
      const newOrder: Order = JSON.parse(newOrderJSON);
      
      // We only want to process it once, so we remove it after reading.
      sessionStorage.removeItem('newOrder');

      // Add to the top of the orders list and prevent duplicates
      setOrders(prevOrders => {
        if (prevOrders.find(o => o.id === newOrder.id)) {
          return prevOrders;
        }
        return [newOrder, ...prevOrders];
      });
    }
  }, [user]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4">Loading Orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 md:px-6 text-center">
        <Frown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-headline">Please login to view your orders.</h2>
        <p className="text-muted-foreground mt-2">You need to be authenticated to see your order history.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  // Now, filter orders based on the state, which includes any new orders
  const userOrders = orders.filter(order => order.userId === user.uid || (order.userId === 'user-3' && !orders.some(o => o.userId === user.uid))); 

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-4xl">
      <div className="mb-8">
        <Button variant="outline" asChild>
            <Link href="/profile">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
            </Link>
        </Button>
       </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-headline">My Orders</CardTitle>
              <CardDescription>View your order history and track your purchases.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">You have no orders yet.</h3>
              <p className="text-muted-foreground mt-2">
                Your purchased items will appear here.
              </p>
              <Button asChild className="mt-6">
                <Link href="/marketplace">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <Card key={order.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    width={120}
                    height={120}
                    className="aspect-square w-full sm:w-32 object-cover rounded-md border"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <Link href={`/marketplace/${order.productId}`} className="hover:underline">
                            <h3 className="font-semibold font-headline text-lg">{order.productName}</h3>
                        </Link>
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                    </div>
                    <p className="text-primary font-bold">₹{order.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                    <p className="text-sm text-muted-foreground">Ordered on: {format(new Date(order.orderDate), "MMMM dd, yyyy")}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
