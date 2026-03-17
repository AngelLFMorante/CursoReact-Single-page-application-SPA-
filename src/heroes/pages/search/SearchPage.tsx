import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";

export const SearchPage = () => {
    return (
        <>
            <CustomJumbotron
                title="Busqueda de SuperHéroes"
                description="Descubre, explora y administra super héroes y villanos"
            />
            {/* Breadcrumb */}
            <CustomBreadcrumbs currentPage="Buscador de heroes" //breadcrumbs={[{ label: 'Home1', to: '/' }]} />
            />

            {/* Stats Dashboard */}
            <HeroStats />

            {/* Filter and search */}
            <SearchControls />
        </>
    )
}

export default SearchPage;
