import prisma from "../ds.js";

export async function syncUserToDb(decodedToken:any) {
  const { uid, email, name} = decodedToken;
  // upsert - create if doesn't exist, else update
  const user = await prisma.user.upsert({
    where: { id: uid },
    update: { email, name },
    create: { id: uid, email, name, password: "" },
  });
  return user;
}
