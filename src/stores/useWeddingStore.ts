import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeddingWebsite, TemplateId, Section, WeddingInfoInput, DeviceType } from '../types/index';
import { defaultSections } from '../data/wedding';

interface WeddingState {
  websites: WeddingWebsite[];
  currentWebsite: WeddingWebsite | null;
  previewDevice: DeviceType;
  isPreviewOpen: boolean;
  
  // Actions
  createWebsite: (templateId: TemplateId, userId: string) => WeddingWebsite;
  updateWeddingInfo: (info: Partial<WeddingInfoInput>) => void;
  updateSections: (sections: Section[]) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  setCurrentWebsite: (website: WeddingWebsite | null) => void;
  publishWebsite: () => void;
  setPreviewDevice: (device: DeviceType) => void;
  openPreview: () => void;
  closePreview: () => void;
  deleteWebsite: (id: string) => void;
}

const generateSlug = () => Math.random().toString(36).substring(2, 8);

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set, get) => ({
      websites: [],
      currentWebsite: null,
      previewDevice: 'desktop',
      isPreviewOpen: false,

      createWebsite: (templateId, userId) => {
        const newWebsite: WeddingWebsite = {
          id: Date.now().toString(),
          userId,
          templateId,
          weddingInfo: {
            partner1Name: '',
            partner2Name: '',
            weddingDate: '',
          },
          sections: defaultSections.map((s) => ({ ...s })),
          slug: generateSlug(),
          isPublished: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          websites: [...state.websites, newWebsite],
          currentWebsite: newWebsite,
        }));

        return newWebsite;
      },

      updateWeddingInfo: (info: Partial<WeddingInfoInput>) => {
        set((state) => {
          if (!state.currentWebsite) return state;
          
          const updated = {
            ...state.currentWebsite,
            weddingInfo: { ...state.currentWebsite.weddingInfo, ...info },
            updatedAt: new Date().toISOString(),
          };

          return {
            currentWebsite: updated,
            websites: state.websites.map((w) =>
              w.id === updated.id ? updated : w
            ),
          };
        });
      },

      updateSections: (sections) => {
        set((state) => {
          if (!state.currentWebsite) return state;
          
          const updated = {
            ...state.currentWebsite,
            sections,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentWebsite: updated,
            websites: state.websites.map((w) =>
              w.id === updated.id ? updated : w
            ),
          };
        });
      },

      toggleSection: (sectionId) => {
        const { currentWebsite } = get();
        if (!currentWebsite) return;

        const updatedSections = currentWebsite.sections.map((s) =>
          s.id === sectionId ? { ...s, enabled: !s.enabled } : s
        );
        get().updateSections(updatedSections);
      },

      reorderSections: (fromIndex, toIndex) => {
        const { currentWebsite } = get();
        if (!currentWebsite) return;

        const enabledSections = currentWebsite.sections.filter((s) => s.enabled);
        const disabledSections = currentWebsite.sections.filter((s) => !s.enabled);

        const [removed] = enabledSections.splice(fromIndex, 1);
        enabledSections.splice(toIndex, 0, removed);

        const reorderedEnabled = enabledSections.map((s, i) => ({ ...s, order: i }));
        const allSections = [...reorderedEnabled, ...disabledSections].sort((a, b) => a.order - b.order);

        get().updateSections(allSections);
      },

      setCurrentWebsite: (website) => {
        set({ currentWebsite: website });
      },

      publishWebsite: () => {
        set((state) => {
          if (!state.currentWebsite) return state;
          
          const updated = {
            ...state.currentWebsite,
            isPublished: true,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentWebsite: updated,
            websites: state.websites.map((w) =>
              w.id === updated.id ? updated : w
            ),
          };
        });
      },

      setPreviewDevice: (device) => set({ previewDevice: device }),
      openPreview: () => set({ isPreviewOpen: true }),
      closePreview: () => set({ isPreviewOpen: false }),

      deleteWebsite: (id) => {
        set((state) => ({
          websites: state.websites.filter((w) => w.id !== id),
          currentWebsite: state.currentWebsite?.id === id ? null : state.currentWebsite,
        }));
      },
    }),
    {
      name: 'wedding-websites',
    }
  )
);
