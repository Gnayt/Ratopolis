module nftmanager {
    use aptos_framework::token::{Token,TokenStore};

    // Define a new resource to represent a fused NFT
    struct FusedNFT has key {
        id: u64,
        components: vector<Token::TokenId>,
    }

    // Define a function to combine multiple NFTs into one
    public fun combine_nfts(nfts: vector<Token::TokenId>): FusedNFT {
        // Check that the NFTs are valid and that the caller is the owner of each NFT
        assert!(nfts.length > 0, 0);
        for nft in &nfts {
            assert!(Token::exists(*nft), 1);
            assert!(Token::is_owner(signer, *nft), 2);
        }

        // Create a new FusedNFT that represents the combination of the input NFTs
        let new_nft = FusedNFT {
            id: Token::generate_id(),
            components: nfts,
        };

        // Transfer the input NFTs to the new FusedNFT
        for nft in &nfts {
            Token::transfer(signer, Token::get_owner(*nft), *nft);
        }

        // Return the new FusedNFT
        return new_nft;
    }

    // Define a function to modify a fused NFT
    public fun modify_fused_nft(fused_nft: &mut FusedNFT, add_nfts: vector<Token::TokenId>, remove_nfts: vector<Token::TokenId>) {
        // Check that the NFTs to be added are valid and that the caller is the owner of each NFT
        for nft in &add_nfts {
            assert!(Token::exists(*nft), 0);
            assert!(Token::is_owner(signer, *nft), 1);
        }

        // Check that the NFTs to be removed are valid and that they are components of the fused NFT
        for nft in &remove_nfts {
            assert!(fused_nft.components.contains(*nft), 2);
        }

        // Add the new NFTs to the fused NFT
        for nft in &add_nfts {
            fused_nft.components.push_back(*nft);
            Token::transfer(signer, Token::get_owner(*nft), *nft);
        }

        // Remove the old NFTs from the fused NFT
        for nft in &remove_nfts {
            let index = fused_nft.components.index_of(*nft);
            fused_nft.components.remove(index);
            Token::transfer(signer, signer, *nft);
        }
    }
}
