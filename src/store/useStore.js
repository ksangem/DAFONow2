import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { patients, orders as initialOrders, drafts as initialDrafts, notifications as initialNotifs, products } from '../data/mockData'

const useStore = create(
  persist(
    (set, get) => ({
      // Patients
      patients,

      // Orders
      orders: initialOrders,

      // Drafts
      drafts: initialDrafts,
      removeDraft: (id) => set(s => ({ drafts: s.drafts.filter(d => d.id !== id) })),

      // Products
      products,

      // Notifications
      notifications: initialNotifs,
      markAllRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
      })),

      // Order creation flow
      newOrder: {
        step: 1,
        patient: null,
        product: null,
        customization: {
          trimStyle: 'standard',
          pattern: '',
          closure: 'velcro',
          padding: 'standard',
          laterality: 'bilateral',
          notes: '',
        },
      },
      setNewOrderStep: (step) => set(s => ({ newOrder: { ...s.newOrder, step } })),
      setNewOrderPatient: (patient) => set(s => ({ newOrder: { ...s.newOrder, patient } })),
      setNewOrderProduct: (product) => set(s => ({ newOrder: { ...s.newOrder, product } })),
      setNewOrderCustomization: (customization) => set(s => ({
        newOrder: { ...s.newOrder, customization: { ...s.newOrder.customization, ...customization } }
      })),
      resetNewOrder: () => set({
        newOrder: {
          step: 1, patient: null, product: null,
          customization: { trimStyle: 'standard', pattern: '', closure: 'velcro', padding: 'standard', laterality: 'bilateral', notes: '' },
        }
      }),

      // UI state
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
    }),
    {
      name: 'dafonow-v2-store',
      partialize: (state) => ({ drafts: state.drafts, newOrder: state.newOrder }),
    }
  )
)

export default useStore
