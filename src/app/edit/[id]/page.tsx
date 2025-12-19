'use server';

import AdForm from "@/components/AdForm";
import { prisma } from "@/libs/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function EditPage(props: Props) {
  const id = props.params.id;
  const user = await currentUser();

  if (!user) {
    return <div>You need to be logged in</div>;
  }

  const adDoc = await prisma.ad.findUnique({
    where: { id }
  });

  if (!adDoc) {
    return <div>404 not found</div>;
  }

  if (user.id !== adDoc.userId) {
    return <div>You are not the owner of this ad</div>;
  }

  // Parse location safely
  const location = adDoc.location as { lat: number, lng: number } | null;

  return (
    <AdForm
      id={adDoc.id}
      defaultTexts={{
        title: adDoc.title,
        price: adDoc.price.toString(), // AdForm likely expects string or number, checking AdForm next
        category: adDoc.category,
        description: adDoc.description,
        contact: adDoc.contact,
      }}
      defaultFiles={adDoc.images}
      defaultLocation={location || { lat: 0, lng: 0 }}
    />
  );
}