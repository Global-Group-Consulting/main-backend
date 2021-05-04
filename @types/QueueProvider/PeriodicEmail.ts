export interface PeriodicEmail {
  title: string
  tmpl: "report_available" | "account_approved" | "new_notification" | "password_forgot" | "password_recovered"
  data: any

  /**
   * Cron date format
   *
   * @link https://github.com/harrisiirak/cron-parser
   */
  monthsInterval: number
  dayOfMonth: number

  // Array of receivers roles
  receivers: number[]

  // dates
  lastRun: any
}
