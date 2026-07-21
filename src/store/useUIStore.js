import { create } from 'zustand';

/**
 * Estado puramente de interfaz (no de dominio): nunca debería
 * persistirse ni pasar por un servicio.
 */
export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Estado del panel de ayuda (HelpDrawer). Vive aquí y no en un store
  // propio del laboratorio de campos vectoriales porque cualquier
  // laboratorio futuro (Gradiente, Divergencia, Integrales...) debe
  // poder abrir su propio contenido de ayuda reutilizando el mismo
  // drawer y el mismo mecanismo de apertura/cierre.
  helpOpen: false,
  helpActiveSectionId: null,
  openHelp: (sectionId = null) => set({ helpOpen: true, helpActiveSectionId: sectionId }),
  closeHelp: () => set({ helpOpen: false }),
}));
