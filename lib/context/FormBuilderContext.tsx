'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type FormDefinition,
  type FormBuilderState,
  type FormBuilderAction,
  type FieldType,
  type FieldConfig,
  type FormPage,
  type FormStyling,
  type FormSettings,
  type FormMode,
  createDefaultForm,
  createField,
  createInitialState,
} from '@/lib/types/form-builder';

// Reducer function
function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState {
  const saveToUndoStack = (currentForm: FormDefinition): FormDefinition[] => {
    const newStack = [...state.undoStack, currentForm];
    // Keep only last 50 states
    if (newStack.length > 50) newStack.shift();
    return newStack;
  };

  switch (action.type) {
    case 'SET_FORM':
      return {
        ...state,
        form: action.payload,
        hasUnsavedChanges: false,
        undoStack: [],
        redoStack: [],
      };

    case 'UPDATE_FORM_NAME':
      return {
        ...state,
        form: {
          ...state.form,
          name: action.payload,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };

    case 'UPDATE_FORM_DESCRIPTION':
      return {
        ...state,
        form: {
          ...state.form,
          description: action.payload,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };

    case 'SET_FORM_MODE': {
      const newMode = action.payload;
      let updatedPages = [...state.form.pages];

      // If switching to inline mode, consolidate all fields to page 1
      if (newMode === 'inline' && state.form.pages.length > 1) {
        const allFieldIds = state.form.pages.flatMap((p) => p.fieldIds);
        updatedPages = [
          {
            ...state.form.pages[0],
            fieldIds: allFieldIds,
          },
        ];
      }

      return {
        ...state,
        form: {
          ...state.form,
          mode: newMode,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        },
        selectedPageIndex: 0,
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'ADD_FIELD': {
      const { fieldType, pageIndex, afterFieldId } = action.payload;
      const existingFieldNames = Object.values(state.form.fields).map((f) => f.name);
      const newField = createField(fieldType, existingFieldNames);

      const page = state.form.pages[pageIndex];
      if (!page) return state;

      let newFieldIds: string[];
      if (afterFieldId) {
        const insertIndex = page.fieldIds.indexOf(afterFieldId);
        if (insertIndex >= 0) {
          newFieldIds = [
            ...page.fieldIds.slice(0, insertIndex + 1),
            newField.id,
            ...page.fieldIds.slice(insertIndex + 1),
          ];
        } else {
          newFieldIds = [...page.fieldIds, newField.id];
        }
      } else {
        newFieldIds = [...page.fieldIds, newField.id];
      }

      const updatedPages = [...state.form.pages];
      updatedPages[pageIndex] = {
        ...page,
        fieldIds: newFieldIds,
      };

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          fields: {
            ...state.form.fields,
            [newField.id]: newField,
          },
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId: newField.id,
        isConfigPanelOpen: true,
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'REMOVE_FIELD': {
      const fieldId = action.payload;
      const updatedFields = { ...state.form.fields };
      delete updatedFields[fieldId];

      const updatedPages = state.form.pages.map((page) => ({
        ...page,
        fieldIds: page.fieldIds.filter((id) => id !== fieldId),
      }));

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          fields: updatedFields,
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId,
        isConfigPanelOpen: state.selectedFieldId === fieldId ? false : state.isConfigPanelOpen,
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'UPDATE_FIELD': {
      const { fieldId, updates } = action.payload;
      const existingField = state.form.fields[fieldId];
      if (!existingField) return state;

      return {
        ...state,
        form: {
          ...state.form,
          fields: {
            ...state.form.fields,
            [fieldId]: {
              ...existingField,
              ...updates,
            },
          },
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'DUPLICATE_FIELD': {
      const sourceField = state.form.fields[action.payload];
      if (!sourceField) return state;

      const existingFieldNames = Object.values(state.form.fields).map((f) => f.name);
      const newField: FieldConfig = {
        ...sourceField,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: generateUniqueName(sourceField.name, existingFieldNames),
        label: `${sourceField.label} (Copy)`,
      };

      // Find the page containing the source field and add after it
      let updatedPages = [...state.form.pages];
      for (let i = 0; i < updatedPages.length; i++) {
        const page = updatedPages[i];
        const fieldIndex = page.fieldIds.indexOf(action.payload);
        if (fieldIndex >= 0) {
          updatedPages[i] = {
            ...page,
            fieldIds: [
              ...page.fieldIds.slice(0, fieldIndex + 1),
              newField.id,
              ...page.fieldIds.slice(fieldIndex + 1),
            ],
          };
          break;
        }
      }

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          fields: {
            ...state.form.fields,
            [newField.id]: newField,
          },
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId: newField.id,
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'REORDER_FIELDS': {
      const { pageIndex, fieldIds } = action.payload;
      const updatedPages = [...state.form.pages];
      if (!updatedPages[pageIndex]) return state;

      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        fieldIds,
      };

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'MOVE_FIELD_TO_PAGE': {
      const { fieldId, targetPageIndex, targetIndex } = action.payload;

      // Remove from current page
      let sourcePageIndex = -1;
      const updatedPages = state.form.pages.map((page, index) => {
        if (page.fieldIds.includes(fieldId)) {
          sourcePageIndex = index;
          return {
            ...page,
            fieldIds: page.fieldIds.filter((id) => id !== fieldId),
          };
        }
        return page;
      });

      if (sourcePageIndex === -1) return state;

      // Add to target page
      const targetPage = updatedPages[targetPageIndex];
      if (!targetPage) return state;

      const insertIndex = targetIndex ?? targetPage.fieldIds.length;
      updatedPages[targetPageIndex] = {
        ...targetPage,
        fieldIds: [
          ...targetPage.fieldIds.slice(0, insertIndex),
          fieldId,
          ...targetPage.fieldIds.slice(insertIndex),
        ],
      };

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        },
        selectedPageIndex: targetPageIndex,
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.payload,
        isConfigPanelOpen: action.payload !== null,
      };

    case 'SET_SELECTED_PAGE':
      return {
        ...state,
        selectedPageIndex: action.payload,
      };

    case 'ADD_PAGE': {
      const afterIndex = action.payload?.afterIndex ?? state.form.pages.length - 1;
      const title = action.payload?.title ?? `Page ${state.form.pages.length + 1}`;

      const newPage: FormPage = {
        id: `page-${Date.now()}`,
        title,
        description: '',
        fieldIds: [],
      };

      const updatedPages = [
        ...state.form.pages.slice(0, afterIndex + 1),
        newPage,
        ...state.form.pages.slice(afterIndex + 1),
      ];

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        },
        selectedPageIndex: afterIndex + 1,
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'REMOVE_PAGE': {
      if (state.form.pages.length <= 1) return state;

      const pageIndex = action.payload;
      const pageToRemove = state.form.pages[pageIndex];
      if (!pageToRemove) return state;

      // Move fields to previous page (or next if removing first)
      const targetPageIndex = pageIndex > 0 ? pageIndex - 1 : 1;
      const updatedPages = state.form.pages
        .map((page, index) => {
          if (index === targetPageIndex) {
            return {
              ...page,
              fieldIds: [...page.fieldIds, ...pageToRemove.fieldIds],
            };
          }
          return page;
        })
        .filter((_, index) => index !== pageIndex);

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        },
        selectedPageIndex: Math.min(state.selectedPageIndex, updatedPages.length - 1),
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'UPDATE_PAGE': {
      const { pageIndex, updates } = action.payload;
      const updatedPages = [...state.form.pages];
      if (!updatedPages[pageIndex]) return state;

      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        ...updates,
      };

      return {
        ...state,
        form: {
          ...state.form,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'REORDER_PAGES': {
      const pageIds = action.payload;
      const pageMap = new Map(state.form.pages.map((p) => [p.id, p]));
      const reorderedPages = pageIds
        .map((id) => pageMap.get(id))
        .filter((p): p is FormPage => p !== undefined);

      return {
        ...state,
        form: {
          ...state.form,
          pages: reorderedPages,
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };
    }

    case 'UPDATE_STYLING':
      return {
        ...state,
        form: {
          ...state.form,
          styling: {
            ...state.form.styling,
            ...action.payload,
          },
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        form: {
          ...state.form,
          settings: {
            ...state.form.settings,
            ...action.payload,
          },
          updatedAt: new Date().toISOString(),
        },
        hasUnsavedChanges: true,
        undoStack: saveToUndoStack(state.form),
        redoStack: [],
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload,
      };

    case 'TOGGLE_TEST_PANEL':
      return {
        ...state,
        isTestPanelOpen: !state.isTestPanelOpen,
      };

    case 'TOGGLE_CONFIG_PANEL':
      return {
        ...state,
        isConfigPanelOpen: !state.isConfigPanelOpen,
      };

    case 'TOGGLE_SETTINGS_PANEL':
      return {
        ...state,
        isSettingsPanelOpen: !state.isSettingsPanelOpen,
      };

    case 'CLOSE_ALL_PANELS':
      return {
        ...state,
        isTestPanelOpen: false,
        isConfigPanelOpen: false,
        isSettingsPanelOpen: false,
      };

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;

      const previousForm = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);

      return {
        ...state,
        form: previousForm,
        undoStack: newUndoStack,
        redoStack: [...state.redoStack, state.form],
        hasUnsavedChanges: true,
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;

      const nextForm = state.redoStack[state.redoStack.length - 1];
      const newRedoStack = state.redoStack.slice(0, -1);

      return {
        ...state,
        form: nextForm,
        undoStack: [...state.undoStack, state.form],
        redoStack: newRedoStack,
        hasUnsavedChanges: true,
      };
    }

    case 'MARK_SAVED':
      return {
        ...state,
        hasUnsavedChanges: false,
      };

    case 'RESET_FORM':
      return createInitialState();

    default:
      return state;
  }
}

// Helper function for generating unique names
function generateUniqueName(baseName: string, existingNames: string[]): string {
  let name = `${baseName}_copy`;
  let counter = 1;
  while (existingNames.includes(name)) {
    name = `${baseName}_copy_${counter}`;
    counter++;
  }
  return name;
}

// Context type
interface FormBuilderContextValue {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;

  // Convenience methods
  addField: (fieldType: FieldType, pageIndex?: number, afterFieldId?: string) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<FieldConfig>) => void;
  duplicateField: (fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  reorderFields: (pageIndex: number, fieldIds: string[]) => void;
  moveFieldToPage: (fieldId: string, targetPageIndex: number, targetIndex?: number) => void;

  // Page methods
  addPage: (afterIndex?: number, title?: string) => void;
  removePage: (pageIndex: number) => void;
  updatePage: (pageIndex: number, updates: Partial<FormPage>) => void;
  setSelectedPage: (pageIndex: number) => void;

  // Form methods
  updateFormName: (name: string) => void;
  updateFormDescription: (description: string) => void;
  setFormMode: (mode: FormMode) => void;
  updateStyling: (styling: Partial<FormStyling>) => void;
  updateSettings: (settings: Partial<FormSettings>) => void;

  // Panel toggles
  toggleTestPanel: () => void;
  toggleConfigPanel: () => void;
  toggleSettingsPanel: () => void;
  closeAllPanels: () => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Form management
  loadForm: (form: FormDefinition) => void;
  resetForm: () => void;
  markSaved: () => void;
}

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}

interface FormBuilderProviderProps {
  children: ReactNode;
  initialForm?: FormDefinition;
}

export function FormBuilderProvider({ children, initialForm }: FormBuilderProviderProps) {
  const [state, dispatch] = useReducer(
    formBuilderReducer,
    createInitialState(initialForm)
  );

  // Convenience methods
  const addField = useCallback(
    (fieldType: FieldType, pageIndex?: number, afterFieldId?: string) => {
      dispatch({
        type: 'ADD_FIELD',
        payload: {
          fieldType,
          pageIndex: pageIndex ?? state.selectedPageIndex,
          afterFieldId,
        },
      });
    },
    [state.selectedPageIndex]
  );

  const removeField = useCallback((fieldId: string) => {
    dispatch({ type: 'REMOVE_FIELD', payload: fieldId });
  }, []);

  const updateField = useCallback((fieldId: string, updates: Partial<FieldConfig>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { fieldId, updates } });
  }, []);

  const duplicateField = useCallback((fieldId: string) => {
    dispatch({ type: 'DUPLICATE_FIELD', payload: fieldId });
  }, []);

  const selectField = useCallback((fieldId: string | null) => {
    dispatch({ type: 'SELECT_FIELD', payload: fieldId });
  }, []);

  const reorderFields = useCallback((pageIndex: number, fieldIds: string[]) => {
    dispatch({ type: 'REORDER_FIELDS', payload: { pageIndex, fieldIds } });
  }, []);

  const moveFieldToPage = useCallback(
    (fieldId: string, targetPageIndex: number, targetIndex?: number) => {
      dispatch({
        type: 'MOVE_FIELD_TO_PAGE',
        payload: { fieldId, targetPageIndex, targetIndex },
      });
    },
    []
  );

  // Page methods
  const addPage = useCallback((afterIndex?: number, title?: string) => {
    dispatch({ type: 'ADD_PAGE', payload: { afterIndex, title } });
  }, []);

  const removePage = useCallback((pageIndex: number) => {
    dispatch({ type: 'REMOVE_PAGE', payload: pageIndex });
  }, []);

  const updatePage = useCallback((pageIndex: number, updates: Partial<FormPage>) => {
    dispatch({ type: 'UPDATE_PAGE', payload: { pageIndex, updates } });
  }, []);

  const setSelectedPage = useCallback((pageIndex: number) => {
    dispatch({ type: 'SET_SELECTED_PAGE', payload: pageIndex });
  }, []);

  // Form methods
  const updateFormName = useCallback((name: string) => {
    dispatch({ type: 'UPDATE_FORM_NAME', payload: name });
  }, []);

  const updateFormDescription = useCallback((description: string) => {
    dispatch({ type: 'UPDATE_FORM_DESCRIPTION', payload: description });
  }, []);

  const setFormMode = useCallback((mode: FormMode) => {
    dispatch({ type: 'SET_FORM_MODE', payload: mode });
  }, []);

  const updateStyling = useCallback((styling: Partial<FormStyling>) => {
    dispatch({ type: 'UPDATE_STYLING', payload: styling });
  }, []);

  const updateSettings = useCallback((settings: Partial<FormSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  // Panel toggles
  const toggleTestPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_TEST_PANEL' });
  }, []);

  const toggleConfigPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_CONFIG_PANEL' });
  }, []);

  const toggleSettingsPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS_PANEL' });
  }, []);

  const closeAllPanels = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_PANELS' });
  }, []);

  // Undo/redo
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  // Form management
  const loadForm = useCallback((form: FormDefinition) => {
    dispatch({ type: 'SET_FORM', payload: form });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const markSaved = useCallback(() => {
    dispatch({ type: 'MARK_SAVED' });
  }, []);

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        dispatch,
        addField,
        removeField,
        updateField,
        duplicateField,
        selectField,
        reorderFields,
        moveFieldToPage,
        addPage,
        removePage,
        updatePage,
        setSelectedPage,
        updateFormName,
        updateFormDescription,
        setFormMode,
        updateStyling,
        updateSettings,
        toggleTestPanel,
        toggleConfigPanel,
        toggleSettingsPanel,
        closeAllPanels,
        undo,
        redo,
        canUndo: state.undoStack.length > 0,
        canRedo: state.redoStack.length > 0,
        loadForm,
        resetForm,
        markSaved,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
