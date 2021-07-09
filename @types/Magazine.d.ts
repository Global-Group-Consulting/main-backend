export interface IMagazine {
  _id: string
  title: string
  coverFileId: string
  fileId: string

  publicationDate: string
  showFrom: string
  showUntil: string

}

export interface FormMagazineCreate{
  title: string,
  publicationDate: string,
  showRange: string,
}

export interface FormMagazineFilesCreate{
  pdfFile: File,
  coverFile: File,
}
