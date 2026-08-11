/**
 * Tony's availability — single source of truth for the booking calendar.
 *
 * Rules (CST = America/Chicago, DST-aware):
 *  - Mon / Tue / Wed / Fri: evening window 17:00–21:00. Sessions must END by 21:00.
 *  - Thursday: closed all day.
 *  - Sat / Sun: 09:00–17:00. Sessions must END by 17:00.
 *  - Slots are offered on a 30-minute grid, starting today through +30 days.
 */

export const TONY_TZ = 'America/Chicago'
export const SLOT_GRID_MIN = 30
export const MAX_BOOKING_DAYS = 30

const DTF_PARTS: Intl.DateTimeFormatOptions = {
  timeZone: TONY_TZ,
  hour12: false,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}

function tzOffsetMs(tz: string, at: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', DTF_PARTS).formatToParts(at)
      .filter(p => p.type !== 'literal')
      .map(p => [p.type, p.value])
  )
  const asUTC = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour) % 24, Number(parts.minute), Number(parts.second)
  )
  return asUTC - at.getTime()
}

/** CST wall-clock components of an instant. */
export function cstParts(at: Date): { year: number; month: number; day: number; hour: number; minute: number; dow: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', DTF_PARTS).formatToParts(at)
      .filter(p => p.type !== 'literal')
      .map(p => [p.type, p.value])
  )
  const year = Number(parts.year)
  const month = Number(parts.month)
  const day = Number(parts.day)
  const hour = Number(parts.hour) % 24
  const minute = Number(parts.minute)
  // day of week in CST: compute via a midday anchor so DST edges can't flip the date
  const anchor = new Date(Date.UTC(year, month - 1, day, 18))
  const dow = new Intl.DateTimeFormat('en-US', { timeZone: TONY_TZ, weekday: 'short' }).format(anchor)
  return { year, month, day, hour, minute, dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dow) }
}

/** Start-of-day in CST (as UTC ms) for a CST calendar date string YYYY-MM-DD. */
function cstDayStartUtc(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  const ref = new Date(Date.UTC(y, m - 1, d, 12)) // noon UTC is always the same CST date
  const offset = tzOffsetMs(TONY_TZ, ref)
  return Date.UTC(y, m - 1, d) - offset
}

/** Is a session [start, start+durationMin] inside Tony's availability? */
export function isWithinAvailability(start: Date, durationMin: number): boolean {
  const end = new Date(start.getTime() + durationMin * 60000)
  const s = cstParts(start)
  const e = cstParts(end)
  const startMin = s.hour * 60 + s.minute
  const endMin = e.hour * 60 + e.minute

  if (s.dow === 4) return false // Thursday: closed
  const weekend = s.dow === 0 || s.dow === 6
  if (weekend) return startMin >= 9 * 60 && endMin <= 17 * 60
  return startMin >= 17 * 60 && endMin <= 21 * 60
}

/** Generate available start times (UTC Date objects) for a CST date and session length. */
export function availableSlotsForDate(dateStr: string, durationMin: number, taken: Date[] = []): Date[] {
  const [y, m, d] = dateStr.split('-').map(Number)
  const probe = cstParts(new Date(cstDayStartUtc(dateStr) + 12 * 3600e3))
  if (probe.dow === 4) return [] // Thursday

  const weekend = probe.dow === 0 || probe.dow === 6
  const windowStart = weekend ? 9 * 60 : 17 * 60
  const windowEnd = weekend ? 17 * 60 : 21 * 60
  const latestStart = windowEnd - durationMin

  const dayStart = cstDayStartUtc(dateStr)
  const slots: Date[] = []
  for (let mOfDay = windowStart; mOfDay <= latestStart; mOfDay += SLOT_GRID_MIN) {
    const start = new Date(dayStart + mOfDay * 60000)
    if (start.getTime() <= Date.now()) continue // past
    const conflict = taken.some(t => Math.abs(t.getTime() - start.getTime()) < 60000)
    if (!conflict) slots.push(start)
  }
  return slots
}

/** Next N CST calendar date strings starting today (for the picker). */
export function upcomingCstDates(n: number): string[] {
  const out: string[] = []
  const today = cstParts(new Date())
  let cursor = new Date(Date.UTC(today.year, today.month - 1, today.day, 12))
  for (let i = 0; i < n; i++) {
    const p = cstParts(cursor)
    out.push(`${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`)
    cursor = new Date(cursor.getTime() + 86400e3)
  }
  return out
}
