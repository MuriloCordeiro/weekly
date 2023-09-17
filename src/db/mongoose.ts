import mongoose from "mongoose";

export default async function connectDB() {
  const url =
    "mongodb+srv://weeklyproject:weeklypassword@cluster0.hbnqz0w.mongodb.net/weeklyDB";

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log("Erro ao conectar ao MongoDB:", err));
}
mongoose.set("debug", true);
