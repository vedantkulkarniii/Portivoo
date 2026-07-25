/**
 * formatDate.js
 * Centralised date formatting utilities for the Portivo frontend.
 */

/**
 * Format a date value to a human-readable string.
 * @param {string|Date} date - The date to format.
 * @param {Intl.DateTimeFormatOptions} [options] - Optional Intl.DateTimeFormat options.
 * @param {string} [locale='en-US'] - BCP 47 locale string.
 * @returns {string} The formatted date string, or an empty string if the input is falsy.
 *
 * @example
 * formatDate('2024-06-15')          // "June 15, 2024"
 * formatDate(new Date(), { year: 'numeric', month: 'short' }) // "Jul 2026"
 */
export function formatDate(date, options = {}, locale = 'en-US') {
  if (!date) return ''

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }

  try {
    return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date))
  } catch {
    return String(date)
  }
}

/**
 * Format a date as a short "Month Year" string (e.g. "Jan 2024").
 * Useful for displaying employment / education date ranges.
 * @param {string|Date} date - The date to format.
 * @returns {string}
 */
export function formatMonthYear(date) {
  return formatDate(date, { year: 'numeric', month: 'short' })
}

/**
 * Format a date range as a readable string.
 * @param {string|Date} start - Start date.
 * @param {string|Date|null} end - End date. Pass null / undefined to show "Present".
 * @returns {string} e.g. "Jan 2022 – Jun 2024" or "Mar 2023 – Present"
 */
export function formatDateRange(start, end) {
  const startStr = formatMonthYear(start)
  const endStr = end ? formatMonthYear(end) : 'Present'
  return `${startStr} – ${endStr}`
}

/**
 * Return the number of years (and months) between two dates.
 * @param {string|Date} start
 * @param {string|Date|null} end - Defaults to now.
 * @returns {string} e.g. "2 yrs 3 mos"
 */
export function formatDuration(start, end = new Date()) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()

  if (months < 0) {
    years -= 1
    months += 12
  }

  const parts = []
  if (years > 0) parts.push(`${years} yr${years !== 1 ? 's' : ''}`)
  if (months > 0) parts.push(`${months} mo${months !== 1 ? 's' : ''}`)

  return parts.length ? parts.join(' ') : '< 1 mo'
}
