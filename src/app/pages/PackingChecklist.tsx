import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { Package, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

export function PackingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Passport', checked: true, category: 'Documents' },
    { id: '2', text: 'Flight tickets', checked: true, category: 'Documents' },
    { id: '3', text: 'Hotel confirmations', checked: false, category: 'Documents' },
    { id: '4', text: 'Travel insurance', checked: true, category: 'Documents' },
    { id: '5', text: 'T-shirts (5)', checked: false, category: 'Clothing' },
    { id: '6', text: 'Jeans (2)', checked: false, category: 'Clothing' },
    { id: '7', text: 'Jacket', checked: true, category: 'Clothing' },
    { id: '8', text: 'Underwear', checked: false, category: 'Clothing' },
    { id: '9', text: 'Toothbrush', checked: true, category: 'Toiletries' },
    { id: '10', text: 'Toothpaste', checked: true, category: 'Toiletries' },
    { id: '11', text: 'Shampoo', checked: false, category: 'Toiletries' },
    { id: '12', text: 'Phone charger', checked: false, category: 'Electronics' },
    { id: '13', text: 'Camera', checked: false, category: 'Electronics' },
    { id: '14', text: 'Power bank', checked: true, category: 'Electronics' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newItemText, setNewItemText] = useState('');

  const categories = ['All', 'Documents', 'Clothing', 'Toiletries', 'Electronics', 'Miscellaneous'];

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText,
        checked: false,
        category: selectedCategory === 'All' ? 'Miscellaneous' : selectedCategory,
      };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const filteredItems =
    selectedCategory === 'All' ? items : items.filter((item) => item.category === selectedCategory);

  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Packing Checklist</h1>
            <p className="text-muted-foreground">Stay organized and don't forget anything</p>
          </div>

          <GlassCard className="p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall Progress</div>
                <div className="text-3xl font-bold">
                  {checkedItems} / {totalItems} items
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </GlassCard>

          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Add new item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                onClick={addItem}
                className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </GlassCard>

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <GlassCard
                key={item.id}
                className={`p-4 transition-all ${item.checked ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleItem(item.id)} className="flex-shrink-0">
                    {item.checked ? (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{item.category}</div>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No items in this category</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
