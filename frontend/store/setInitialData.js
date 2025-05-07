export const useCompetitionStore = create(set => ({
    zawody: {
      miejsce: '',
      data: new Date().toISOString().slice(0, 10),
      sedzia: {
        imie: '',
        nazwisko: '',
        avatar: null,
      },
      klubAvatar: null,
    },
    kategorie: [],
    zawodnicy: [],
    setInitialData: (data) => set(() => ({
      zawody: data.zawody,
      kategorie: data.kategorie,
      zawodnicy: data.zawodnicy,
    })),
    // ... pozostałe akcje ...
  }));