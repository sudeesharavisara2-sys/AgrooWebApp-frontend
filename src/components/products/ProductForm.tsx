import React, { useState } from 'react';
import { PRODUCT_CATEGORIES, PRODUCT_TYPES, SALE_TYPES, type ProductCategory, type ProductRequest, type ProductType } from '../../types';
import { humanizeEnum } from '../../utils/helpers';
import { 
  Package, 
  MapPin, 
  Phone, 
  Calendar, 
  Image as ImageIcon, 
  CheckCircle2, 
  Leaf, 
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

interface Props {
  initial?: Partial<ProductRequest>;
  submitLabel?: string;
  allowImages?: boolean;
  onSubmit: (data: ProductRequest, images?: File[]) => Promise<void>;
}

// List of Sri Lankan districts
const SRI_LANKAN_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

// ProductCategory අනුව අදාළ ProductTypes Map එක නිර්මාණය කිරීම
const CATEGORY_TO_TYPES_MAP: Record<ProductCategory, ProductType[]> = {
  FRESH_PRODUCE: [
    'VEGETABLES', 'FRUITS', 'RICE', 'GRAINS', 'YAMS_AND_ROOTS', 'SPICES', 'SEEDLINGS', 'PLANTS_AND_FLOWERS', 'OTHER_CROPS'
  ],
  FERTILIZERS: [
    'ORGANIC_FERTILIZER', 'CHEMICAL_FERTILIZER', 'COMPOST', 'LIQUID_FERTILIZER', 'PESTICIDES', 'OTHER_AGRO_CHEMICALS'
  ],
  LIVESTOCK: [
    'CATTLE', 'CHICKEN', 'GOAT', 'PIG', 'BUFFALO', 'OTHER_LIVESTOCK'
  ],
  DAIRY_PRODUCTS: [
    'MILK', 'CURD', 'YOGURT', 'CHEESE', 'OTHER_DAIRY'
  ],
  MACHINERY_RENTALS: [
    'TRACTOR', 'HARVESTER', 'TILLER', 'SPRAYER', 'WATER_PUMPS', 'OTHER_MACHINERY'
  ]
};

const emptyForm: ProductRequest = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  unit: 'kg',
  category: 'FRESH_PRODUCE',
  productType: 'VEGETABLES',
  saleType: 'RETAIL',
  location: '',
  district: '',
  address: '',
  isAvailable: true,
  isOrganic: false,
  contactPhone: '',
  contactWhatsapp: '',
};

const ProductForm: React.FC<Props> = ({ initial, submitLabel = 'Save Product', allowImages = true, onSubmit }) => {
  const [form, setForm] = useState<ProductRequest>({ ...emptyForm, ...initial });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductRequest>(key: K, value: ProductRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Category එක වෙනස් වන විට අදාළ Product Types ලබා ගැනීම සහ පළමුවැන්න Default ලෙස සැකසීම
  const handleCategoryChange = (newCategory: ProductCategory) => {
    const availableTypes = CATEGORY_TO_TYPES_MAP[newCategory] || PRODUCT_TYPES;
    setForm((f) => ({
      ...f,
      category: newCategory,
      productType: availableTypes[0] // නව Category එකට අදාළ පළමු Type එක තෝරයි
    }));
  };

  // Function to handle phone fields allowing only numbers and a maximum of 10 digits
  const handlePhoneChange = (key: 'contactPhone' | 'contactWhatsapp', value: string) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    update(key, cleanedValue);
  };

  // Function to handle price and quantity fields allowing only positive numbers
  const handleNumberChange = (key: 'price' | 'quantity', value: string) => {
    if (value === '') {
      update(key, 0);
      return;
    }
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      update(key, num);
    }
  };

  // Function to append newly selected images to the existing image array
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  // Function to remove an unwanted image from the preview list by index
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that contact phone numbers contain exactly 10 digits if provided
    if (form.contactPhone && form.contactPhone.length !== 10) {
      setError('Contact Phone must be exactly 10 digits.');
      return;
    }
    if (form.contactWhatsapp && form.contactWhatsapp.length !== 10) {
      setError('Contact WhatsApp must be exactly 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      const sanitizedData: ProductRequest = {
        ...form,
        harvestDate: form.harvestDate ? new Date(form.harvestDate).toISOString() : undefined,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
      };

      await onSubmit(sanitizedData, images);
    } catch (err) {
      setError((err as { message?: string })?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  // වත්මන් Category එකට අදාළ Product Types පමණක් පෙරළා ගැනීම (Filter)
  const currentProductTypes = CATEGORY_TO_TYPES_MAP[form.category] || PRODUCT_TYPES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      
      {/* Header Title */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-emerald-600" size={24} />
          {submitLabel}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to list your agricultural product.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 shadow-sm">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Basic Information
        </h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="e.g., Fresh Organic Carrots"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            rows={3}
            placeholder="Write a brief description about your product quality..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
      </div>

      {/* Section 2: Pricing & Inventory */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cost per {form.unit || 'unit'} (Rs.) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
              value={form.price === 0 ? '' : form.price}
              onChange={(e) => handleNumberChange('price', e.target.value)}
              placeholder="0.00"
            />
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              * Enter the price for 1 {form.unit || 'unit'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.quantity === 0 ? '' : form.quantity}
              onChange={(e) => handleNumberChange('quantity', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="kg, liter, unit..."
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.category}
              onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{humanizeEnum(c)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Type</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.productType}
              onChange={(e) => update('productType', e.target.value as ProductType)}
            >
              {currentProductTypes.map((t) => (
                <option key={t} value={t}>{humanizeEnum(t)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Sale Type</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.saleType}
              onChange={(e) => update('saleType', e.target.value as ProductRequest['saleType'])}
            >
              {SALE_TYPES.map((t) => (
                <option key={t} value={t}>{humanizeEnum(t)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Location & Contact */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Location & Contact
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MapPin size={16} />
              </span>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                placeholder="City / Area"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.district}
              onChange={(e) => update('district', e.target.value)}
            >
              <option value="">Select District</option>
              {SRI_LANKAN_DISTRICTS.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Street address"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone (10 Digits)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Phone size={16} />
              </span>
              <input
                type="text"
                maxLength={10}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="07XXXXXXXX"
                value={form.contactPhone}
                onChange={(e) => handlePhoneChange('contactPhone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact WhatsApp (10 Digits)</label>
            <input
              type="text"
              maxLength={10}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="07XXXXXXXX"
              value={form.contactWhatsapp}
              onChange={(e) => handlePhoneChange('contactWhatsapp', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Dates & Attributes */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Dates & Status
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Harvest Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={form.harvestDate?.slice(0, 10) || ''}
                onChange={(e) => update('harvestDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={form.expiryDate?.slice(0, 10) || ''}
                onChange={(e) => update('expiryDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100/80 transition-all">
            <input
              type="checkbox"
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              checked={form.isAvailable}
              onChange={(e) => update('isAvailable', e.target.checked)}
            />
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Available for Sale</span>
          </label>

          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100/80 transition-all">
            <input
              type="checkbox"
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              checked={form.isOrganic}
              onChange={(e) => update('isOrganic', e.target.checked)}
            />
            <Leaf size={16} className="text-emerald-600" />
            <span>Organic Produce</span>
          </label>
        </div>
      </div>

      {/* Section 5: Image Upload & Previews */}
      {allowImages && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
            Product Images
          </h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                <ImageIcon className="w-8 h-8 mb-2 text-emerald-600" />
                <p className="mb-1 text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Uploaded Images Preview Grid with Remove Option */}
          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Selected Images ({images.length}):</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((file, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100 transition-all hover:scale-110"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] active:scale-95 disabled:opacity-50 w-full sm:w-auto"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Saving Product...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;