"use client";

import { useState } from "react";

export default function CreateCarPage() {
  const [form, setForm] = useState<{
    brand: string;
    model: string;
    year: string;
    price: string;
    currency: string;
    engineType: string;
    engineFuel: string;
    engineHp: string;
    engineTransmission: string;
    mileage: string;
    condition: string;
    imageFile: File | null;
    status: string;
    tags: string;
  }>({
    brand: "",
    model: "",
    year: "",
    price: "",
    currency: "USD",
    engineType: "",
    engineFuel: "",
    engineHp: "",
    engineTransmission: "",
    mileage: "",
    condition: "Used",
    imageFile: null,
    status: "Available",
    tags: ""
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!form.imageFile) return "";
    const data = new FormData();
    data.append("file", form.imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.url || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Upload image to Cloudinary and get URL
    const uploadedImageUrl = await uploadImageToCloudinary();
    if (!uploadedImageUrl) {
      alert("Image upload failed. Please try again.");
      setLoading(false);
      return;
    }
    setImageUrl(uploadedImageUrl);

    const payload = {
      brand: form.brand,
      model: form.model,
      year: parseInt(form.year),
      price: parseFloat(form.price),
      currency: form.currency,
      engine: {
        type: form.engineType,
        fuel: form.engineFuel,
        hp: parseInt(form.engineHp),
        transmission: form.engineTransmission,
      },
      mileage: parseInt(form.mileage),
      condition: form.condition,
      imageUrl: uploadedImageUrl,
      status: form.status,
      tags: form.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Car created successfully!");
        setForm({
          brand: "",
          model: "",
          year: "",
          price: "",
          currency: "",
          engineType: "",
          engineFuel: "",
          engineHp: "",
          engineTransmission: "",
          mileage: "",
          condition: "",
          imageFile: null,
          status: "",
          tags: ""
        });
        setImageUrl("");
      } else {
        alert("Error creating car. Please try again.");
      }
    } catch (error) {
      alert("Error creating car. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create a New Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Model</label>
          <input
            type="text"
            name="model"
            value={form.model}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
            </select>
          </div>
        </div>

        <fieldset className="border p-4 rounded">
          <legend className="font-medium">Engine Details</legend>

          <div className="grid grid-cols-4 gap-4 mt-2">
            <input
              type="text"
              name="engineType"
              placeholder="Type"
              value={form.engineType}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="engineFuel"
              placeholder="Fuel"
              value={form.engineFuel}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="engineHp"
              placeholder="HP"
              value={form.engineHp}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="engineTransmission"
              placeholder="Transmission"
              value={form.engineTransmission}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>
        </fieldset>

        <div>
          <label className="block font-medium">Mileage</label>
          <input
            type="number"
            name="mileage"
            value={form.mileage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded" className="mt-2 max-h-48" />
          )}
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
        >
          {loading ? "Creating..." : "Create Car"}
        </button>
      </form>
    </div>
  );
}
