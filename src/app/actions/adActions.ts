'use server';

import { Location } from "@/components/LocationPicker";
import { prisma } from "@/libs/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAd(formData: FormData) {
  const { files, location, _id, ...data } = Object.fromEntries(formData);
  const user = await currentUser();
  const userId = user?.id; // Clerk User ID
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userId || !userEmail) {
    throw new Error("Unauthorized");
  }

  // Ensure user exists in local DB
  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email: userEmail,
      name: user.fullName || user.firstName || "User",
      avatar: user.imageUrl,
    },
    update: {
      email: userEmail,
      avatar: user.imageUrl,
    }
  });

  const parsedLocation = JSON.parse(location as string);
  const parsedFiles = JSON.parse(files as string); // string[]

  const newAdData = {
    title: data.title as string,
    price: parseFloat(data.price as string),
    category: data.category as string,
    description: data.description as string,
    contact: data.contact as string,
    images: parsedFiles,
    location: parsedLocation,
    userId: userId,
  };

  const newAdDoc = await prisma.ad.create({
    data: newAdData,
  });

  return JSON.parse(JSON.stringify(newAdDoc));
}

export async function updateAd(formData: FormData) {
  const { _id, files, location, ...data } = Object.fromEntries(formData);
  const user = await currentUser();

  if (!user) return;

  const adId = _id as string;
  const adDoc = await prisma.ad.findUnique({
    where: { id: adId }
  });

  if (!adDoc || adDoc.userId !== user.id) {
    return; // Or throw error
  }

  const parsedLocation = JSON.parse(location as string);
  const parsedFiles = JSON.parse(files as string);

  const adData = {
    title: data.title as string,
    price: parseFloat(data.price as string),
    category: data.category as string,
    description: data.description as string,
    contact: data.contact as string,
    images: parsedFiles,
    location: parsedLocation,
  };

  const updatedAd = await prisma.ad.update({
    where: { id: adId },
    data: adData
  });

  revalidatePath(`/ad/` + adId);
  return JSON.parse(JSON.stringify(updatedAd));
}
