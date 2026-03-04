"use strict";
// Utility functions for exporting data
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToCSV = exports.flattenObject = void 0;
const flattenObject = (obj, prefix = '') => {
    let flattened = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}_${key}` : key;
            if (Array.isArray(value)) {
                // Convert arrays to comma-separated strings
                flattened[newKey] = value.map((item) => typeof item === 'object' && item !== null ? item.name || item.id : item).join(', ');
            }
            else if (value instanceof Date) {
                flattened[newKey] = value.toISOString();
            }
            else if (typeof value === 'object' && value !== null) {
                // For nested objects, skip if it's already handled
                continue;
            }
            else {
                flattened[newKey] = value;
            }
        }
    }
    return flattened;
};
exports.flattenObject = flattenObject;
const convertToCSV = (data) => {
    if (!data || data.length === 0) {
        return '';
    }
    // Flatten objects
    const flattenedData = data.map(item => (0, exports.flattenObject)(item));
    // Get all unique keys
    const keys = Array.from(new Set(flattenedData.flatMap(item => Object.keys(item))));
    // Create header row
    const header = keys.join(',');
    // Create data rows
    const rows = flattenedData.map(item => {
        return keys.map(key => {
            const value = item[key];
            if (value === null || value === undefined) {
                return '';
            }
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });
    return [header, ...rows].join('\n');
};
exports.convertToCSV = convertToCSV;
