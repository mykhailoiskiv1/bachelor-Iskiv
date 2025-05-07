export type Invoice = {
    id: number
    title: string
    fileUrl: string
    issuedDate: string
    totalAmount: number
    projectName: string
    client: {
      id: string
      name: string
    }
  }
  