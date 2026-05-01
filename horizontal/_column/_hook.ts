import type { Updater, VisibilityState } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { parseAsJson, useQueryState } from "nuqs";
import { useLocalStorage } from "usehooks-ts";
import { toTitleCase } from "@/lib";

type ColumnPresetsByPath = Record<string, Record<string, VisibilityState>>;

export function useColumnTable() {
  const pathname = usePathname();
  const [columnVisibilityState, setColumnVisibilityState] =
    useQueryState<VisibilityState>(
      "columns",
      parseAsJson<VisibilityState>((value: unknown): VisibilityState | null => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          const entries = Object.entries(value);

          if (entries.every(([_, v]) => typeof v === "boolean"))
            return value as VisibilityState;
        }
        return null;
      }).withDefault({}),
    );

  const getColumnVisibility = () => columnVisibilityState || {};

  const getColumnVisibilityLength = () =>
    Object.keys(columnVisibilityState || {}).length;

  const setColumnVisibility = (updater: Updater<VisibilityState>) => {
    setColumnVisibilityState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      return Object.fromEntries(
        Object.entries(next).filter(([_, value]) => value === false),
      );
    });
  };

  const updateColumnVisibilityByPreset = (name: string) => {
    const preset =
      columnPresetsStorage[pathname.toLowerCase()]?.[toTitleCase(name)];

    if (preset) setColumnVisibility(preset);
  };

  const removeColumnVisibility = () => {
    setColumnVisibility({});
  };

  const [columnPresetsStorage, setColumnPresetsStorage] =
    useLocalStorage<ColumnPresetsByPath>("column-presets", {});

  const getColumnsPresets = () => {
    return columnPresetsStorage[pathname.toLowerCase()] || {};
  };

  const getIsNamePresentInColumnsPreset = (name: string) => {
    const presets = columnPresetsStorage[pathname.toLowerCase()] || {};

    return Object.keys(presets).some(
      (presetName) => presetName.toLowerCase() === name.toLowerCase(),
    );
  };

  const getIsColumnsPresentInColumnsPreset = (
    columns: Record<string, boolean> = columnVisibilityState,
  ) => {
    const presets = columnPresetsStorage[pathname.toLowerCase()] || {};

    return Object.values(presets).some((preset) => {
      const presetColumns = Object.keys(preset);
      const columnsKeys = Object.keys(columns);

      if (presetColumns.length !== columnsKeys.length) return false;

      return presetColumns.every(
        (col) => col in columns && preset[col] === columns[col],
      );
    });
  };

  const getIsColumnsPresetActive = (name: string) => {
    const preset =
      columnPresetsStorage[pathname.toLowerCase()]?.[toTitleCase(name)];

    if (
      !preset ||
      !columnVisibilityState ||
      Object.keys(preset).length !== Object.keys(columnVisibilityState).length
    )
      return false;

    return Object.keys(preset).every(
      (col) =>
        col in columnVisibilityState &&
        preset[col] === columnVisibilityState[col],
    );
  };

  const saveColumnsPreset = (data: {
    name: string;
    columnVisibility: Record<string, boolean>;
  }) => {
    const { name, columnVisibility } = data;

    setColumnPresetsStorage({
      ...columnPresetsStorage,
      [pathname.toLowerCase()]: {
        ...columnPresetsStorage[pathname.toLowerCase()],
        [toTitleCase(name)]: columnVisibility,
      },
    });
  };

  const updateColumnsPreset = (name: string) => {
    const presets = { ...columnPresetsStorage[pathname.toLowerCase()] };

    delete presets[name];

    setColumnPresetsStorage({
      ...columnPresetsStorage,
      [pathname.toLowerCase()]: presets,
    });
  };

  const deleteColumnsPreset = (name: string) => {
    const presets = { ...columnPresetsStorage[pathname.toLowerCase()] };
    delete presets[name];
    setColumnPresetsStorage({
      ...columnPresetsStorage,
      [pathname.toLowerCase()]: presets,
    });
  };

  const deleteAllColumnsPresets = () => {
    const updatedPresets = { ...columnPresetsStorage };
    delete updatedPresets[pathname.toLowerCase()];
    setColumnPresetsStorage(updatedPresets);
  };

  return {
    getColumnVisibility,
    getColumnVisibilityLength,
    setColumnVisibility,
    updateColumnVisibilityByPreset,
    removeColumnVisibility,
    getColumnsPresets,
    getIsNamePresentInColumnsPreset,
    getIsColumnsPresentInColumnsPreset,
    getIsColumnsPresetActive,
    saveColumnsPreset,
    updateColumnsPreset,
    deleteColumnsPreset,
    deleteAllColumnsPresets,
  };
}
