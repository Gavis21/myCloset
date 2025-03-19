import { createTheme, ThemeProvider } from "@mui/material/styles";
import baseTheme from "../../theme.ts";
import ExploreOutfitCard from "../../components/ExploreOutfitCard.tsx";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { explore } from "../../services/outfit-service.ts";
import LoadingOverlay from "react-loading-overlay-ts";

type IOutfit = {
  id: number;
  src: string;
  descriptiom: string;
  photographer: string;
};

const ExplorePageTheme = createTheme({
  ...baseTheme,
});

async function fetchOutfits(): Promise<IOutfit[]> {
  const response = await explore();

  if (response.photos) {
    return response.photos.map(
      ({ id, src: { original }, alt, photographer }) => ({
        id,
        src: original,
        descriptiom: alt,
        photographer,
      })
    );
  }
  console.error("Cannot fetch explore outfits");
  return [];
}

export default function ExplorePage() {
  const [outfits, setOutfits] = useState<IOutfit[]>([]);
  const [isLoadingActive, setIsLoadingActive] = useState(false);

  useEffect(() => {
    setIsLoadingActive(true);
    fetchOutfits().then((outfits) => {
      setOutfits(outfits);
      setIsLoadingActive(false);
    });
  }, []);

  return (
    <ThemeProvider theme={ExplorePageTheme}>
      <LoadingOverlay active={isLoadingActive} spinner text="Signing up...">
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}
          style={{ flexDirection: "column" }}
        >
          {outfits?.map(({ id, src, photographer, descriptiom }) => (
            <Grid item xs={8} sm={8} md={8} lg={8} key={id}>
              <ExploreOutfitCard
                title={photographer}
                description={descriptiom}
                imageUrl={src}
              />
            </Grid>
          ))}
        </Grid>
      </LoadingOverlay>
    </ThemeProvider>
  );
}
